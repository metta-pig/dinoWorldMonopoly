/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GAME_TYPE?: string;
  readonly VITE_GAME_DELIVERABLE?: string;
  readonly VITE_GAME_AUDIENCE?: string;
  readonly VITE_GAME_MULTIPLAYER?: string;
  readonly VITE_GAME_TITLE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
