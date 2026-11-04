/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL base do backend, sem barra no final. Em branco, o site usa dados simulados. */
  readonly VITE_API_URL?: string
  /** "true" força os dados simulados mesmo com VITE_API_URL definido. */
  readonly VITE_USE_MOCK?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
