import {
  BOARD_SIZE,
  EXHIBIT_COST,
  HABITATS,
  HATCHERY_BONUS,
  HATCHERY_INDEX,
  MAX_NESTS,
  NEST_COST,
  ROUTES,
  STARTING_CASH,
  TAR_PIT_EXIT_FEE,
  TAR_PIT_INDEX,
  ROUTE_RENT_ONE,
  ROUTE_RENT_BOTH,
  getHabitat,
  getPropertyLabel,
  getPropertyPrice,
  getSpace,
  habitatsInBiome,
} from "./board";
import {
  cardAdvanceTarget,
  cardBankCharge,
  cardBankPayment,
  cardCollectFromEach,
  cardGoBack,
  cardGrantsGetOut,
  cardPayEachPlayer,
  cardSendsToTarPit,
  collectHatcheryOnAdvance,
  getCard,
  shuffledDeckIds,
} from "./cards";
import type {
  GameAction,
  GameState,
  PlayerId,
  PlayerState,
  PropertyKey,
  PropertyState,
} from "./types";

export const initialGameState: GameState = {
  phase: "setup",
  turnPhase: "roll",
  activePlayer: "p1",
  players: [],
  playerStates: {},
  properties: {},
  fossilDeck: [],
  fossilDiscard: [],
  parkDeck: [],
  parkDiscard: [],
  lastRoll: null,
  pendingCard: null,
  pendingPayment: null,
  message: "Choose 2–4 explorers to start the park tour.",
  log: [],
  winner: null,
};

function rollDice(): [number, number] {
  const d1 = Math.floor(Math.random() * 6) + 1;
  const d2 = Math.floor(Math.random() * 6) + 1;
  return [d1, d2];
}

function isDoubles([a, b]: [number, number]): boolean {
  return a === b;
}

function appendLog(state: GameState, line: string): string[] {
  return [...state.log.slice(-19), line];
}

function initialProperties(): Record<PropertyKey, PropertyState> {
  const props: Record<PropertyKey, PropertyState> = {};
  for (const h of HABITATS) {
    props[h.id] = { ownerId: null, nests: 0, hasExhibit: false };
  }
  for (const r of ROUTES) {
    props[r.key] = { ownerId: null, nests: 0, hasExhibit: false };
  }
  return props;
}

function activePlayers(state: GameState): PlayerId[] {
  return state.players.filter((id) => !state.playerStates[id]?.bankrupt);
}

function nextPlayer(state: GameState, from?: PlayerId): PlayerId {
  const alive = activePlayers(state);
  const current = from ?? state.activePlayer;
  const idx = alive.indexOf(current);
  if (idx === -1 || alive.length === 0) {
    return alive[0] ?? current;
  }
  return alive[(idx + 1) % alive.length]!;
}

function updatePlayer(
  state: GameState,
  id: PlayerId,
  patch: Partial<PlayerState>,
): GameState {
  const current = state.playerStates[id];
  if (!current) {
    return state;
  }
  return {
    ...state,
    playerStates: {
      ...state.playerStates,
      [id]: { ...current, ...patch },
    },
  };
}

function updateProperty(
  state: GameState,
  key: PropertyKey,
  patch: Partial<PropertyState>,
): GameState {
  const current = state.properties[key];
  if (!current) {
    return state;
  }
  return {
    ...state,
    properties: {
      ...state.properties,
      [key]: { ...current, ...patch },
    },
  };
}

function ownsFullBiome(
  state: GameState,
  playerId: PlayerId,
  biome: NonNullable<ReturnType<typeof getHabitat>>["biome"],
): boolean {
  const group = habitatsInBiome(biome);
  return group.every((h) => state.properties[h.id]?.ownerId === playerId);
}

function countOwnedRoutes(state: GameState, playerId: PlayerId): number {
  return ROUTES.filter((r) => state.properties[r.key]?.ownerId === playerId).length;
}

function calculateRent(
  state: GameState,
  propertyKey: PropertyKey,
  ownerId: PlayerId,
): number {
  const habitat = getHabitat(propertyKey);
  if (habitat) {
    const prop = state.properties[propertyKey]!;
    if (prop.hasExhibit) {
      return habitat.exhibitRent;
    }
    let base = habitat.baseRent;
    if (ownsFullBiome(state, ownerId, habitat.biome)) {
      base *= 2;
    }
    if (prop.nests === 1) {
      return habitat.nestRent;
    }
    if (prop.nests === 2) {
      return habitat.nestRent * 2;
    }
    return base;
  }
  const owned = countOwnedRoutes(state, ownerId);
  if (owned === 2) {
    return ROUTE_RENT_BOTH;
  }
  if (owned === 1) {
    return ROUTE_RENT_ONE;
  }
  return 0;
}

function playerNetWorth(state: GameState, playerId: PlayerId): number {
  const player = state.playerStates[playerId];
  if (!player) {
    return 0;
  }
  let total = player.cash;
  for (const [key, prop] of Object.entries(state.properties)) {
    if (prop.ownerId === playerId) {
      total += getPropertyPrice(key);
      if (prop.hasExhibit) {
        total += EXHIBIT_COST;
      } else {
        total += prop.nests * NEST_COST;
      }
    }
  }
  return total;
}

function checkWinner(state: GameState): GameState {
  const alive = activePlayers(state);
  if (alive.length === 1 && state.players.length > 1) {
    const winner = alive[0]!;
    return {
      ...state,
      phase: "finished",
      turnPhase: "ended",
      winner,
      message: `${state.playerStates[winner]?.name ?? winner} wins the park!`,
    };
  }
  return state;
}

function returnPropertiesToBank(state: GameState, playerId: PlayerId): GameState {
  let next = state;
  for (const key of Object.keys(next.properties)) {
    const prop = next.properties[key as PropertyKey];
    if (prop?.ownerId === playerId) {
      next = updateProperty(next, key as PropertyKey, {
        ownerId: null,
        nests: 0,
        hasExhibit: false,
      });
    }
  }
  return next;
}

function bankruptPlayer(state: GameState, playerId: PlayerId): GameState {
  const name = state.playerStates[playerId]?.name ?? playerId;
  let next = updatePlayer(state, playerId, {
    bankrupt: true,
    cash: 0,
    inTarPit: false,
    getOutOfTarPitCards: 0,
  });
  next = returnPropertiesToBank(next, playerId);
  next = {
    ...next,
    log: appendLog(next, `${name} went bankrupt.`),
    message: `${name} is bankrupt!`,
  };
  return checkWinner(next);
}

function transferCash(
  state: GameState,
  from: PlayerId,
  to: PlayerId | "bank",
  amount: number,
): GameState {
  const payer = state.playerStates[from];
  if (!payer || amount <= 0) {
    return state;
  }
  if (payer.cash < amount) {
    return bankruptPlayer(state, from);
  }
  let next = updatePlayer(state, from, { cash: payer.cash - amount });
  if (to !== "bank") {
    const receiver = next.playerStates[to];
    if (receiver) {
      next = updatePlayer(next, to, { cash: receiver.cash + amount });
    }
  }
  return next;
}

function drawFromDeck(
  state: GameState,
  deck: "fossil" | "park",
): { state: GameState; cardId: string | null } {
  const deckKey = deck === "fossil" ? "fossilDeck" : "parkDeck";
  const discardKey = deck === "fossil" ? "fossilDiscard" : "parkDiscard";
  let deckIds = [...state[deckKey]];
  let discard = [...state[discardKey]];
  if (deckIds.length === 0) {
    deckIds = discard;
    discard = [];
  }
  if (deckIds.length === 0) {
    return { state, cardId: null };
  }
  const [cardId, ...rest] = deckIds;
  return {
    state: { ...state, [deckKey]: rest, [discardKey]: discard },
    cardId: cardId ?? null,
  };
}

function discardCard(state: GameState, deck: "fossil" | "park", cardId: string): GameState {
  const card = getCard(deck, cardId);
  if (card?.keep) {
    return state;
  }
  const discardKey = deck === "fossil" ? "fossilDiscard" : "parkDiscard";
  return {
    ...state,
    [discardKey]: [...state[discardKey], cardId],
  };
}

function passHatchery(from: number, steps: number): boolean {
  return from + steps >= BOARD_SIZE;
}

function moveToPosition(
  state: GameState,
  playerId: PlayerId,
  target: number,
  collectPassGo: boolean,
): GameState {
  const player = state.playerStates[playerId];
  if (!player) {
    return state;
  }
  let next = state;
  const normalized = ((target % BOARD_SIZE) + BOARD_SIZE) % BOARD_SIZE;
  if (collectPassGo && normalized < player.position && player.position !== normalized) {
    next = updatePlayer(next, playerId, {
      cash: player.cash + HATCHERY_BONUS,
    });
    next = {
      ...next,
      log: appendLog(next, `${player.name} passed Hatchery (+$${HATCHERY_BONUS}).`),
    };
  }
  next = updatePlayer(next, playerId, { position: normalized });
  if (normalized === HATCHERY_INDEX) {
    const cash = next.playerStates[playerId]?.cash ?? 0;
    next = updatePlayer(next, playerId, { cash: cash + HATCHERY_BONUS });
  }
  return next;
}

function sendToTarPit(state: GameState, playerId: PlayerId): GameState {
  let next = updatePlayer(state, playerId, {
    position: TAR_PIT_INDEX,
    inTarPit: true,
  });
  next = {
    ...next,
    log: appendLog(
      next,
      `${state.playerStates[playerId]?.name ?? playerId} was sent to the Tar Pit.`,
    ),
  };
  return next;
}

function enterBuildPhase(state: GameState, playerId: PlayerId): GameState {
  if (state.playerStates[playerId]?.inTarPit) {
    return {
      ...state,
      turnPhase: "tar_pit_choice",
      message: `Pay $${TAR_PIT_EXIT_FEE} or roll doubles to leave the Tar Pit.`,
    };
  }
  return {
    ...state,
    turnPhase: "build",
    message: "Build nests or an exhibit, or end your turn.",
  };
}

function endTurn(state: GameState): GameState {
  const nextPlayerId = nextPlayer(state);
  return {
    ...state,
    activePlayer: nextPlayerId,
    turnPhase: "roll",
    lastRoll: null,
    pendingCard: null,
    pendingPayment: null,
    message: `${state.playerStates[nextPlayerId]?.name ?? nextPlayerId}'s turn — roll the dice.`,
  };
}

function promptRentOrBuy(
  state: GameState,
  propertyKey: PropertyKey,
  buyerId: PlayerId,
): GameState {
  const prop = state.properties[propertyKey];
  if (!prop) {
    return enterBuildPhase(state, buyerId);
  }
  if (prop.ownerId === null) {
    const price = getPropertyPrice(propertyKey);
    const canAfford = (state.playerStates[buyerId]?.cash ?? 0) >= price;
    if (!canAfford) {
      return enterBuildPhase(
        {
          ...state,
          message: `Cannot afford ${getPropertyLabel(propertyKey)} ($${price}).`,
        },
        buyerId,
      );
    }
    return {
      ...state,
      turnPhase: "buy_prompt",
      message: `Buy ${getPropertyLabel(propertyKey)} for $${price}?`,
    };
  }
  if (prop.ownerId === buyerId) {
    return enterBuildPhase(state, buyerId);
  }
  const rent = calculateRent(state, propertyKey, prop.ownerId);
  const ownerName = state.playerStates[prop.ownerId]?.name ?? prop.ownerId;
  return {
    ...state,
    turnPhase: "pay_prompt",
    pendingPayment: {
      toPlayerId: prop.ownerId,
      amount: rent,
      reason: `Visit fee for ${getPropertyLabel(propertyKey)} to ${ownerName}`,
    },
    message: `Pay $${rent} visit fee to ${ownerName}.`,
  };
}

function afterLanding(state: GameState, playerId: PlayerId): GameState {
  const space = getSpace(state.playerStates[playerId]?.position ?? 0);
  switch (space.kind) {
    case "hatchery":
      return enterBuildPhase(state, playerId);
    case "habitat":
    case "route":
      return promptRentOrBuy(state, space.propertyKey!, playerId);
    case "fee": {
      const amount = space.feeAmount ?? 0;
      return {
        ...state,
        turnPhase: "pay_prompt",
        pendingPayment: {
          toPlayerId: "bank",
          amount,
          reason: space.label,
        },
        message: `Pay $${amount} for ${space.label}.`,
      };
    }
    case "fossil_find":
    case "park_event": {
      const deck = space.kind === "fossil_find" ? "fossil" : "park";
      const drawn = drawFromDeck(state, deck);
      if (!drawn.cardId) {
        return enterBuildPhase(drawn.state, playerId);
      }
      const card = getCard(deck, drawn.cardId);
      return {
        ...drawn.state,
        turnPhase: "card_prompt",
        pendingCard: { deck, cardId: drawn.cardId },
        message: card?.text ?? "Draw a card.",
      };
    }
    case "tar_pit":
      return {
        ...state,
        message: "Just visiting the Tar Pit.",
        turnPhase: "build",
      };
    case "free_digging":
      return enterBuildPhase(state, playerId);
    case "ranger":
      return enterBuildPhase(sendToTarPit(state, playerId), playerId);
    default:
      return enterBuildPhase(state, playerId);
  }
}

function applyCardEffects(state: GameState, playerId: PlayerId): GameState {
  const pending = state.pendingCard;
  if (!pending) {
    return enterBuildPhase(state, playerId);
  }
  const { deck, cardId } = pending;
  let next = state;

  if (cardGrantsGetOut(cardId)) {
    const cards = next.playerStates[playerId]?.getOutOfTarPitCards ?? 0;
    next = updatePlayer(next, playerId, { getOutOfTarPitCards: cards + 1 });
  }

  const bankPay = cardBankPayment(cardId);
  if (bankPay > 0) {
    const cash = next.playerStates[playerId]?.cash ?? 0;
    next = updatePlayer(next, playerId, { cash: cash + bankPay });
  }

  const bankCharge = cardBankCharge(cardId);
  if (bankCharge > 0) {
    next = transferCash(next, playerId, "bank", bankCharge);
    if (next.playerStates[playerId]?.bankrupt) {
      return endTurn(checkWinner(next));
    }
  }

  const payEach = cardPayEachPlayer(cardId);
  if (payEach > 0) {
    for (const other of activePlayers(next).filter((id) => id !== playerId)) {
      next = transferCash(next, playerId, other, payEach);
      if (next.playerStates[playerId]?.bankrupt) {
        return endTurn(checkWinner(next));
      }
    }
  }

  const collectEach = cardCollectFromEach(cardId);
  if (collectEach > 0) {
    for (const other of activePlayers(next).filter((id) => id !== playerId)) {
      next = transferCash(next, other, playerId, collectEach);
    }
  }

  if (cardSendsToTarPit(cardId)) {
    next = sendToTarPit(next, playerId);
    next = discardCard(next, deck, cardId);
    return {
      ...next,
      pendingCard: null,
      turnPhase: "tar_pit_choice",
      message: `You are in the Tar Pit. Pay $${TAR_PIT_EXIT_FEE} or roll doubles on your next turn.`,
    };
  }

  const advance = cardAdvanceTarget(cardId);
  if (advance !== null) {
    const from = next.playerStates[playerId]?.position ?? 0;
    const collect =
      cardId === "ff-hatchery"
        ? collectHatcheryOnAdvance(cardId, from, advance)
        : false;
    next = moveToPosition(next, playerId, advance, collect);
    next = discardCard(next, deck, cardId);
    next = { ...next, pendingCard: null };
    return afterLanding(next, playerId);
  }

  const back = cardGoBack(cardId);
  if (back > 0) {
    const pos = next.playerStates[playerId]?.position ?? 0;
    next = moveToPosition(next, playerId, pos - back, false);
    next = discardCard(next, deck, cardId);
    next = { ...next, pendingCard: null };
    return afterLanding(next, playerId);
  }

  next = discardCard(next, deck, cardId);
  return enterBuildPhase({ ...next, pendingCard: null }, playerId);
}

export function canBuildNest(
  state: GameState,
  playerId: PlayerId,
  propertyKey: PropertyKey,
): boolean {
  const habitat = getHabitat(propertyKey);
  if (!habitat) {
    return false;
  }
  const prop = state.properties[propertyKey];
  if (!prop || prop.ownerId !== playerId || prop.hasExhibit) {
    return false;
  }
  if (prop.nests >= MAX_NESTS) {
    return false;
  }
  if (!ownsFullBiome(state, playerId, habitat.biome)) {
    return false;
  }
  const player = state.playerStates[playerId];
  if (!player || player.cash < NEST_COST) {
    return false;
  }
  const group = habitatsInBiome(habitat.biome);
  const minNests = Math.min(...group.map((h) => state.properties[h.id]?.nests ?? 0));
  return prop.nests <= minNests;
}

export function canBuildExhibit(
  state: GameState,
  playerId: PlayerId,
  propertyKey: PropertyKey,
): boolean {
  const habitat = getHabitat(propertyKey);
  if (!habitat) {
    return false;
  }
  const prop = state.properties[propertyKey];
  if (!prop || prop.ownerId !== playerId || prop.hasExhibit || prop.nests < MAX_NESTS) {
    return false;
  }
  if (!ownsFullBiome(state, playerId, habitat.biome)) {
    return false;
  }
  const player = state.playerStates[playerId];
  return (player?.cash ?? 0) >= EXHIBIT_COST;
}

export function buildableProperties(state: GameState, playerId: PlayerId): PropertyKey[] {
  return HABITATS.filter(
    (h) => canBuildNest(state, playerId, h.id) || canBuildExhibit(state, playerId, h.id),
  ).map((h) => h.id);
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START": {
      const count = action.playerCount;
      const players: PlayerId[] = Array.from({ length: count }, (_, i) => `p${i + 1}`);
      const playerStates: Record<PlayerId, PlayerState> = {};
      for (let i = 0; i < count; i++) {
        const id = players[i]!;
        playerStates[id] = {
          id,
          name: action.names?.[i] ?? `Explorer ${i + 1}`,
          cash: STARTING_CASH,
          position: HATCHERY_INDEX,
          inTarPit: false,
          bankrupt: false,
          getOutOfTarPitCards: 0,
        };
      }
      return {
        ...initialGameState,
        phase: "playing",
        turnPhase: "roll",
        activePlayer: players[0]!,
        players,
        playerStates,
        properties: initialProperties(),
        fossilDeck: shuffledDeckIds("fossil"),
        parkDeck: shuffledDeckIds("park"),
        message: `${playerStates[players[0]!]?.name}'s turn — roll the dice!`,
        log: ["Park opened! Good luck, explorers."],
      };
    }

    case "ROLL_DICE": {
      if (state.phase !== "playing" || state.turnPhase !== "roll") {
        return state;
      }
      const playerId = state.activePlayer;
      const player = state.playerStates[playerId];
      if (!player || player.bankrupt) {
        return state;
      }
      if (player.inTarPit) {
        return {
          ...state,
          turnPhase: "tar_pit_choice",
          message: `Pay $${TAR_PIT_EXIT_FEE} or roll doubles to leave the Tar Pit first.`,
        };
      }

      const roll = rollDice();
      const steps = roll[0] + roll[1];
      const from = player.position;
      const to = (from + steps) % BOARD_SIZE;
      let next = state;
      let cash = player.cash;

      if (passHatchery(from, steps)) {
        cash += HATCHERY_BONUS;
        next = {
          ...next,
          log: appendLog(next, `${player.name} passed Hatchery (+$${HATCHERY_BONUS}).`),
        };
      }

      next = updatePlayer(next, playerId, { position: to, cash });
      if (to === HATCHERY_INDEX) {
        const c = next.playerStates[playerId]?.cash ?? 0;
        next = updatePlayer(next, playerId, { cash: c + HATCHERY_BONUS });
      }

      next = {
        ...next,
        lastRoll: roll,
        log: appendLog(next, `${player.name} rolled ${roll[0]}+${roll[1]}=${steps}.`),
      };

      const landedSpace = getSpace(to);
      if (landedSpace.kind === "ranger") {
        next = sendToTarPit(next, playerId);
        return enterBuildPhase(next, playerId);
      }

      return afterLanding(next, playerId);
    }

    case "TAR_PIT_PAY": {
      if (state.turnPhase !== "tar_pit_choice") {
        return state;
      }
      const playerId = state.activePlayer;
      let next = transferCash(state, playerId, "bank", TAR_PIT_EXIT_FEE);
      if (next.playerStates[playerId]?.bankrupt) {
        return endTurn(checkWinner(next));
      }
      next = updatePlayer(next, playerId, { inTarPit: false });
      return {
        ...next,
        turnPhase: "roll",
        message: "You left the Tar Pit! Roll to move.",
        log: appendLog(
          next,
          `${state.playerStates[playerId]?.name ?? playerId} paid $${TAR_PIT_EXIT_FEE} to leave the Tar Pit.`,
        ),
      };
    }

    case "TAR_PIT_ROLL": {
      if (state.turnPhase !== "tar_pit_choice") {
        return state;
      }
      const playerId = state.activePlayer;
      const roll = rollDice();
      if (isDoubles(roll)) {
        const steps = roll[0] + roll[1];
        let next = updatePlayer(state, playerId, { inTarPit: false });
        const from = next.playerStates[playerId]?.position ?? TAR_PIT_INDEX;
        const to = (from + steps) % BOARD_SIZE;
        let cash = next.playerStates[playerId]?.cash ?? 0;
        if (passHatchery(from, steps)) {
          cash += HATCHERY_BONUS;
        }
        next = updatePlayer(next, playerId, { position: to, cash });
        if (to === HATCHERY_INDEX) {
          const c = next.playerStates[playerId]?.cash ?? 0;
          next = updatePlayer(next, playerId, { cash: c + HATCHERY_BONUS });
        }
        next = {
          ...next,
          lastRoll: roll,
          log: appendLog(
            next,
            `${state.playerStates[playerId]?.name} rolled doubles and left the Tar Pit.`,
          ),
        };
        return afterLanding(next, playerId);
      }
      return endTurn({
        ...state,
        lastRoll: roll,
        message: "No doubles — turn ends in the Tar Pit.",
        log: appendLog(
          state,
          `${state.playerStates[playerId]?.name} failed to roll doubles in the Tar Pit.`,
        ),
      });
    }

    case "USE_GET_OUT_CARD": {
      if (state.turnPhase !== "tar_pit_choice") {
        return state;
      }
      const playerId = state.activePlayer;
      const cards = state.playerStates[playerId]?.getOutOfTarPitCards ?? 0;
      if (cards < 1) {
        return state;
      }
      const next = updatePlayer(state, playerId, {
        getOutOfTarPitCards: cards - 1,
        inTarPit: false,
      });
      return {
        ...next,
        turnPhase: "roll",
        message: "Used Get Out of Tar Pit card! Roll to move.",
        log: appendLog(
          next,
          `${state.playerStates[playerId]?.name ?? playerId} used a Get Out of Tar Pit card.`,
        ),
      };
    }

    case "BUY_PROPERTY": {
      if (state.turnPhase !== "buy_prompt") {
        return state;
      }
      const playerId = state.activePlayer;
      const pos = state.playerStates[playerId]?.position ?? 0;
      const space = getSpace(pos);
      const propertyKey = space.propertyKey;
      if (!propertyKey) {
        return enterBuildPhase(state, playerId);
      }
      const prop = state.properties[propertyKey];
      if (!prop || prop.ownerId !== null) {
        return enterBuildPhase(state, playerId);
      }
      const price = getPropertyPrice(propertyKey);
      const cash = state.playerStates[playerId]?.cash ?? 0;
      if (cash < price) {
        return enterBuildPhase({ ...state, message: "Not enough cash to buy." }, playerId);
      }
      let next = updatePlayer(state, playerId, { cash: cash - price });
      next = updateProperty(next, propertyKey, { ownerId: playerId });
      next = {
        ...next,
        log: appendLog(
          next,
          `${state.playerStates[playerId]?.name} bought ${getPropertyLabel(propertyKey)} for $${price}.`,
        ),
        message: `You bought ${getPropertyLabel(propertyKey)}!`,
      };
      return enterBuildPhase(next, playerId);
    }

    case "PASS_BUY": {
      if (state.turnPhase !== "buy_prompt") {
        return state;
      }
      const name = state.playerStates[state.activePlayer]?.name ?? state.activePlayer;
      return enterBuildPhase(
        {
          ...state,
          message: "Passed on buying.",
          log: appendLog(state, `${name} passed on buying.`),
        },
        state.activePlayer,
      );
    }

    case "PAY_PENDING": {
      if (state.turnPhase !== "pay_prompt" || !state.pendingPayment) {
        return state;
      }
      const playerId = state.activePlayer;
      const { toPlayerId, amount, reason } = state.pendingPayment;
      let next = transferCash(state, playerId, toPlayerId, amount);
      if (next.playerStates[playerId]?.bankrupt) {
        return endTurn(checkWinner(next));
      }
      next = {
        ...next,
        pendingPayment: null,
        log: appendLog(
          next,
          `${state.playerStates[playerId]?.name} paid $${amount} (${reason}).`,
        ),
      };
      return enterBuildPhase(next, playerId);
    }

    case "RESOLVE_CARD": {
      if (state.turnPhase !== "card_prompt") {
        return state;
      }
      return applyCardEffects(state, state.activePlayer);
    }

    case "BUILD_NEST": {
      if (state.turnPhase !== "build") {
        return state;
      }
      const playerId = state.activePlayer;
      if (!canBuildNest(state, playerId, action.propertyKey)) {
        return state;
      }
      const prop = state.properties[action.propertyKey]!;
      let next = updatePlayer(state, playerId, {
        cash: (state.playerStates[playerId]?.cash ?? 0) - NEST_COST,
      });
      next = updateProperty(next, action.propertyKey, { nests: prop.nests + 1 });
      return {
        ...next,
        message: `Built a nest on ${getPropertyLabel(action.propertyKey)} (−$${NEST_COST}).`,
        log: appendLog(
          next,
          `${state.playerStates[playerId]?.name} built a nest on ${getPropertyLabel(action.propertyKey)}.`,
        ),
      };
    }

    case "BUILD_EXHIBIT": {
      if (state.turnPhase !== "build") {
        return state;
      }
      const playerId = state.activePlayer;
      if (!canBuildExhibit(state, playerId, action.propertyKey)) {
        return state;
      }
      let next = updatePlayer(state, playerId, {
        cash: (state.playerStates[playerId]?.cash ?? 0) - EXHIBIT_COST,
      });
      next = updateProperty(next, action.propertyKey, {
        nests: 0,
        hasExhibit: true,
      });
      return {
        ...next,
        message: `Built an exhibit on ${getPropertyLabel(action.propertyKey)} (−$${EXHIBIT_COST}).`,
        log: appendLog(
          next,
          `${state.playerStates[playerId]?.name} built an exhibit on ${getPropertyLabel(action.propertyKey)}.`,
        ),
      };
    }

    case "END_BUILD": {
      if (state.turnPhase === "card_prompt") {
        return endTurn(applyCardEffects(state, state.activePlayer));
      }
      if (state.turnPhase === "pay_prompt" && state.pendingPayment) {
        return state;
      }
      if (
        state.turnPhase === "build" ||
        state.turnPhase === "buy_prompt" ||
        state.turnPhase === "tar_pit_choice"
      ) {
        return endTurn(state);
      }
      return state;
    }

    case "DECLARE_NET_WORTH_WINNER": {
      const alive = activePlayers(state);
      if (alive.length === 0) {
        return state;
      }
      let best = alive[0]!;
      let bestWorth = playerNetWorth(state, best);
      for (const id of alive) {
        const worth = playerNetWorth(state, id);
        if (worth > bestWorth) {
          best = id;
          bestWorth = worth;
        }
      }
      return {
        ...state,
        phase: "finished",
        turnPhase: "ended",
        winner: best,
        message: `${state.playerStates[best]?.name ?? best} wins by net worth ($${bestWorth})!`,
      };
    }

    default:
      return state;
  }
}
