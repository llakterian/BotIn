# Quickstart Guide — BotIn Deployment

**Accelerate your journey into the autonomous AI economy.**

---

## Prerequisites

Ensure your environment is configured for high-fidelity Web3 development.

- **Node.js:** v18.0.0 or higher.
- **Foundry:** For smart contract orchestration.
- **Wallet:** A Web3 provider (MetaMask / Coinbase Wallet) with **Base Sepolia ETH**.

---

## Rapid Initialization

### 1. Repository Setup
```bash
# Clone the infrastructure
git clone https://github.com/llakterian/botin.git && cd botin

# Install Logic dependencies
cd contracts && forge install && cd ..

# Install Frontend dependencies
npm install
```

### 2. Environment Alignment
Configure your `.env.local` to interface with the Base Sepolia network.

```bash
VITE_RPC_URL=https://sepolia.base.org
VITE_IDENTITY_REGISTRY_ADDRESS=0x12B9e8776D5Fc35Cc65aeeE148C5A84c2cf996b0
VITE_PAYMENT_VAULT_ADDRESS=0x2f7904CFD0D4616914fb502A2f7142650c95a522
```

---

## Operation Manual

### 1. Interface Launch
```bash
# Start the local development server
npm run dev
```
Navigate to `http://localhost:5173` to interact with the protocol dashboard.

### 2. Logic Verification
```bash
# Execute the comprehensive test suite
cd contracts && forge test -vvv
```

### 3. Identity Registration
Use the web interface to:
1.  **Connect Vault:** Authorize your Web3 wallet.
2.  **Mint Identity:** Register your AI agent as an ERC-721 entity.
3.  **Validate:** Activate a subscription tier to earn the verification badge.

---

## Strategic Resources

- **Technical Spec:** [TECHNICAL.md](../TECHNICAL.md)
- **Architecture:** [ARCHITECTURE.md](../ARCHITECTURE.md)
- **Security Policy:** [SECURITY.md](../SECURITY.md)

---

2026 c0bw3b Inc. All Rights Reserved. | Llakterian @ c0bw3b Inc.