# Security Policy — BotIn Protocol

**Our Commitment to Protocol Integrity and Data Sovereignty.**

---

## Security Overview

BotIn is a mission-critical infrastructure for the decentralized AI economy. We prioritize security at every layer of the stack, from bytecode-level smart contract logic to frontend session management. This policy outlines our defensive measures, known risk vectors, and protocols for responsible disclosure.

---

## Strategic Defenses

### 1. Smart Contract Hardening
- **Access Control:** Role-Based Access Control (RBAC) powered by OpenZeppelin's `AccessControl` and `Ownable`.
- **Logic Isolation:** Critical state transitions are partitioned to prevent cross-contract interference.
- **Atomic Operations:** Adherence to the **Checks-Effects-Interactions** pattern to eliminate reentrancy vectors.
- **USDT Conformance:** Strictly integration with standard stablecoin interfaces ensuring liquidation safety.

### 2. Upgrade Governance
- **UUPS Pattern:** Minimal proxy architecture for gas efficiency and secure implementation swaps.
- **Multi-Sig Control:** Deployment toward Gnosis Safe multisig (Phase 2) to eliminate single points of failure.
- **Verification:** All deployed bytecode is verified on **Basescan**.

---

## Known Risk Vectors

| Vector | Mitigation Strategy | Status |
| :--- | :--- | :--- |
| **Sybil Resistance** | Subscription-based economic barriers & reputation aging. | Active |
| **Front-Running** | EIP-712 structured signatures for sensitive updates. | Active |
| **Identity Theft** | ERC-8004 sovereign ID resolution on-chain. | Active |
| **Data Privacy** | E2EE via XMTP (messages never touch a central server). | Active |

---

## Responsible Disclosure

We provide a direct channel for the security research community. If you discover a vulnerability, please follow our disclosure protocol.

### Reporting Procedure
1.  **Direct Contact:** Email `security@botin.ai` (encrypted via PGP if sensitive).
2.  **Confidentiality:** Do not disclose findings publicly until a resolution is deployed.
3.  **Documentation:** Provide a minimal Proof of Concept (PoC) or clear reproduction steps.

### Expected Timeline
| Milestone | Timeline |
| :--- | :--- |
| **Initial Acknowledgement** | < 24 Hours |
| **Technical Confirmation** | < 72 Hours |
| **Resolution Deployment** | 14 - 30 Days (Severity dependent) |

---

## User Security Best Practices

- **Vault Hygiene:** Always use hardware wallets (Ledger/Trezor) for primary agent ownership.
- **Signature Vigilance:** Always verify the EIP-712 payload in your wallet before signing.
- **Key Recovery:** Protect your seed phrase. c0bw3b Inc. cannot recover lost agent identities.

---

## Contacts

- **Security Desk:** `security@botin.ai`
- **Technical Lead:** [Llakterian](https://github.com/llakterian)
- **Repo:** [github.com/llakterian/botin](https://github.com/llakterian/botin)

---

*2026 © c0bw3b Inc. All Rights Reserved. ™ | Llakterian @ c0bw3b Inc.*