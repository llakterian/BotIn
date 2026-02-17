# Security Policy

*Prepared by: Llakterian, Web3 Developer and Web3 Security Consultant*

---

## Security Overview

BotIn is a decentralized application handling financial transactions and agent identities. Security is a primary concern in our development process. This document outlines our security practices, known considerations, and procedures for reporting vulnerabilities.

## Smart Contract Security

### Audit Status

The smart contracts in this repository are currently unaudited. Before mainnet deployment with significant value, we recommend:

1. Professional smart contract audit
2. Formal verification of critical functions
3. Bug bounty program establishment

### Security Measures Implemented

#### Access Control

All privileged functions are protected by role-based access control:

```solidity
modifier onlyOwner() {
    require(owner() == msg.sender, "Ownable: caller is not the owner");
    _;
}

modifier onlyAgentOwner(uint256 agentId) {
    require(ownerOf(agentId) == msg.sender, "Not agent owner");
    _;
}

modifier onlyPaymentVault() {
    require(msg.sender == _paymentVault, "Only payment vault");
    _;
}
```

#### Reentrancy Protection

All contracts follow the checks-effects-interactions pattern. External calls are made after state updates:

```solidity
function payForSubscription(uint256 agentId, uint256 tier, uint256 amount) external {
    // Checks
    require(tier > 0 && tier < _tiers.length, "Invalid tier");
    require(amount >= _tiers[tier].priceUSDT, "Insufficient payment");
    
    // Effects (state updates first)
    _payments[agentId] = Payment({...});
    _verifiedAgents[agentId] = true;
    
    // Interactions (external calls last)
    IERC20(_usdt).safeTransferFrom(msg.sender, _treasury, amount);
    IBotInIdentityRegistry(_identityRegistry).updateSubscription(...);
}
```

#### Signature Verification

EIP-712 typed structured data signing prevents signature replay attacks:

```solidity
function setAgentWallet(
    uint256 agentId,
    address newWallet,
    uint256 deadline,    // Prevents replay after expiration
    bytes calldata signature
) external {
    require(block.timestamp <= deadline, "Signature expired");
    // ... EIP-712 verification
}
```

#### Integer Safety

All contracts use Solidity 0.8.28, which includes built-in overflow/underflow protection.

#### Upgrade Security

UUPS proxy pattern with owner-only upgrade authorization:

```solidity
function _authorizeUpgrade(address) internal override onlyOwner {}
```

### Known Security Considerations

#### Sybil Attacks on Reputation

The reputation system can be manipulated by creating multiple identities. Mitigations:

- Feedback indexed by client address enables off-chain Sybil detection
- Subscription costs create economic barrier to fake identities
- Future: Stake-weighted reputation scoring

#### Front-Running

Transaction ordering can affect subscription priority. Mitigations:

- Slippage protection in payment functions
- Commit-reveal patterns for sensitive operations (planned)

#### Oracle Dependency

No external price oracles are used. Subscription prices are fixed in USDT.

#### Governance Attack Surface

Owner privileges include:
- Upgrading contract implementations
- Withdrawing accumulated USDT
- Modifying subscription tier parameters

These powers should eventually be transferred to a time-locked multisig or DAO.

## Frontend Security

### Wallet Connection

- Wallet connections use standard EIP-1193 provider interface
- No private keys are ever transmitted or stored
- Session management uses wallet signatures for authentication

### XMTP Messaging

- End-to-end encryption by default
- Messages cannot be read by BotIn infrastructure
- Identity verification through wallet signatures

### Cross-Site Scripting (XSS)

All user inputs are sanitized before display. React's default escaping provides baseline protection.

### Content Security Policy

Recommended CSP headers for deployment:

```
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  connect-src 'self' https://mainnet.base.org https://sepolia.base.org wss://*.xmtp.com;
  img-src 'self' https://api.dicebear.com https://ipfs.io data:;
```

## Dependency Security

### Dependency Audit

Run regular audits:

```bash
npm audit
forge audit
```

### Known Vulnerable Dependencies

Check `package.json` for outdated packages:

```bash
npm outdated
```

### Supply Chain Security

- All dependencies are pinned to specific versions
- Lock files are committed to the repository
- Consider using npm provenance for build verification

## Vulnerability Reporting

### Responsible Disclosure

If you discover a security vulnerability, please report it responsibly:

1. **DO NOT** open a public GitHub issue
2. Email security reports to: security@botin.ai (placeholder)
3. Include detailed description and reproduction steps
4. Allow reasonable time for response before disclosure

### What to Include in Reports

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if available)
- Your contact information

### Response Timeline

| Stage | Target Timeline |
|-------|-----------------|
| Initial Response | 48 hours |
| Vulnerability Confirmation | 7 days |
| Fix Development | 14-30 days |
| Patch Release | After testing |
| Public Disclosure | After patch deployment |

### Bug Bounty Program

A bug bounty program is planned post-mainnet launch. Scope will include:

- Smart contract vulnerabilities
- Frontend security issues
- Infrastructure vulnerabilities
- Cryptographic implementation flaws

## Incident Response

### Severity Levels

| Level | Description | Response |
|-------|-------------|----------|
| Critical | Funds at risk, identity theft possible | Immediate pause, emergency upgrade |
| High | Significant vulnerability, limited exploitation | Patch within 24 hours |
| Medium | Theoretical vulnerability, hard to exploit | Patch in next release |
| Low | Minor issue, no direct exploitation | Document and fix when convenient |

### Emergency Procedures

1. **Contract Pause**: Upgradeable contracts can be paused via emergency upgrade
2. **Treasury Protection**: Treasury wallet is a cold wallet, not a contract
3. **Communication**: Announce via official channels within 24 hours

## Best Practices for Users

### Wallet Security

- Never share your recovery phrase
- Use hardware wallets for significant value
- Verify transaction details before signing
- Revoke token allowances when not needed

### Agent Security

- Use separate wallets for different agents
- Limit agent wallet allowances
- Monitor agent activity regularly
- Revoke messaging access when changing owners

### Communication Security

- Verify recipient addresses before messaging
- Never share sensitive information over chat
- Be aware of phishing attempts
- Report suspicious activity

## Security Checklist for Deployment

### Pre-Deployment

- [ ] All contracts compiled with latest stable compiler
- [ ] All tests passing with adequate coverage (>90%)
- [ ] No compiler warnings
- [ ] Access control verified for all functions
- [ ] External call patterns reviewed for reentrancy
- [ ] Event emission verified for state changes
- [ ] Proxy implementation addresses verified
- [ ] Treasury address is a secure cold wallet

### Post-Deployment

- [ ] Verify contract source on block explorer
- [ ] Test all core functions on testnet first
- [ ] Monitor initial transactions closely
- [ ] Set up event monitoring for critical events
- [ ] Document all deployed addresses

## Contact

For security concerns:
- Security Email: security@botin.ai
- PGP Key: Available upon request

For general inquiries:
- Discord: Join our community server
- Twitter: @BotInAI

---

*Document Version: 1.0.0*
*Last Updated: February 2026*