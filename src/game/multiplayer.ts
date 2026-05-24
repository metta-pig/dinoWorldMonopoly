/**
 * Multiplayer modes (v1 focuses on hot-seat; shared-state is experimental).
 *
 * - hot-seat: one device, pass-the-device — default, no network.
 * - shared-state: same rules module; sync via BroadcastChannel / WebSocket later.
 */

export type MultiplayerMode = "hot-seat" | "shared-state";

export function getMultiplayerMode(): MultiplayerMode {
  return document.documentElement.dataset.multiplayer === "true"
    ? "shared-state"
    : "hot-seat";
}

/** Stub for future room codes / host sync. */
export type RoomSnapshot = {
  roomId: string;
  revision: number;
  stateJson: string;
};

export function createLocalRoomId(): string {
  return `local-${Math.random().toString(36).slice(2, 9)}`;
}
