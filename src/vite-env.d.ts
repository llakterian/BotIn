/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string
  readonly VITE_WALLETCONNECT_PROJECT_ID: string
  readonly VITE_XMTP_ENV: string
  readonly VITE_PARTICLE_PROJECT_ID: string
  readonly VITE_PARTICLE_CLIENT_KEY: string
  readonly VITE_PARTICLE_APP_ID: string
  readonly VITE_SUBGRAPH_URL: string
  readonly VITE_IDENTITY_REGISTRY_ADDRESS: string
  readonly VITE_PAYMENT_VAULT_ADDRESS: string
  readonly VITE_REPUTATION_REGISTRY_ADDRESS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
