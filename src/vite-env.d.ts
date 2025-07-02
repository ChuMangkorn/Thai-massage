/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_JWT_SECRET?: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
