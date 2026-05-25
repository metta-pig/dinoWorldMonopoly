import { HATCHERY_BONUS } from "./board";

export type CardDef = {
  id: string;
  text: string;
  keep?: boolean;
};

export const FOSSIL_FIND_CARDS: CardDef[] = [
  {
    id: "ff-hatchery",
    text: `Advance to Hatchery. Collect $${HATCHERY_BONUS} if you pass it.`,
  },
  { id: "ff-trex", text: "Advance to T-Rex Valley." },
  { id: "ff-bank-50", text: "Bank pays you $1." },
  { id: "ff-get-out", text: "Get Out of Tar Pit free. Keep this card.", keep: true },
  { id: "ff-back-3", text: "Go back 3 spaces." },
  { id: "ff-pay-25", text: "Pay $1 fee to the bank." },
  { id: "ff-free-digging", text: "Advance to Free Digging." },
  { id: "ff-pay-each-10", text: "Pay each player $1." },
];

export const PARK_EVENT_CARDS: CardDef[] = [
  { id: "pe-bank-100", text: "Bank pays you $2." },
  { id: "pe-repairs-50", text: "Pay $1 for park repairs." },
  { id: "pe-pay-25", text: "Pay $1 to the bank." },
  { id: "pe-collect-each-25", text: "Collect $1 from each player." },
  { id: "pe-stego", text: "Advance to Stego Meadow." },
  {
    id: "pe-tar-pit",
    text: `Go directly to Tar Pit. Do not collect $${HATCHERY_BONUS}.`,
  },
  { id: "pe-bank-20", text: "Bank pays you $1." },
  { id: "pe-birthday", text: "Birthday! Collect $1 from each player." },
];

export function getCard(deck: "fossil" | "park", id: string): CardDef | undefined {
  const list = deck === "fossil" ? FOSSIL_FIND_CARDS : PARK_EVENT_CARDS;
  return list.find((c) => c.id === id);
}

export function shuffledDeckIds(deck: "fossil" | "park", rng = Math.random): string[] {
  const ids = (deck === "fossil" ? FOSSIL_FIND_CARDS : PARK_EVENT_CARDS).map(
    (c) => c.id,
  );
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [ids[i], ids[j]] = [ids[j]!, ids[i]!];
  }
  return ids;
}

/** Target board index for advance-to cards. */
export function cardAdvanceTarget(cardId: string): number | null {
  switch (cardId) {
    case "ff-hatchery":
      return 0;
    case "ff-trex":
      return 18;
    case "ff-free-digging":
      return 10;
    case "pe-stego":
      return 11;
    default:
      return null;
  }
}

export function cardSendsToTarPit(cardId: string): boolean {
  return cardId === "pe-tar-pit";
}

export function cardGoBack(cardId: string): number {
  return cardId === "ff-back-3" ? 3 : 0;
}

export function cardBankPayment(cardId: string): number {
  switch (cardId) {
    case "ff-bank-50":
    case "pe-bank-20":
      return 1;
    case "pe-bank-100":
      return 2;
    default:
      return 0;
  }
}

export function cardBankCharge(cardId: string): number {
  switch (cardId) {
    case "ff-pay-25":
    case "pe-pay-25":
    case "pe-repairs-50":
      return 1;
    default:
      return 0;
  }
}

export function cardPayEachPlayer(cardId: string): number {
  return cardId === "ff-pay-each-10" ? 1 : 0;
}

export function cardCollectFromEach(cardId: string): number {
  if (cardId === "pe-collect-each-25" || cardId === "pe-birthday") {
    return 1;
  }
  return 0;
}

export function cardGrantsGetOut(cardId: string): boolean {
  return cardId === "ff-get-out";
}

export function collectHatcheryOnAdvance(cardId: string, from: number, to: number): boolean {
  if (cardId !== "ff-hatchery") {
    return false;
  }
  if (from < to && to > 0) {
    return true;
  }
  return from > to && to <= 0;
}
