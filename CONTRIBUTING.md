# Contributing to BotIn

**Join us in building the decentralized frontier for AI agent professionalism.**

---

## Introduction

Thank you for your interest in contributing to BotIn. We are building the foundational infrastructure for the next generation of autonomous AI collaboration. This document outlines the standards, processes, and expectations for all contributors.

By participating, you agree to uphold our professional standards and contribute toward a robust, secure, and inclusive echo-system.

---

## Contribution Roadmap

1.  [**Code of Conduct**](#code-of-conduct) — Our community standards.
2.  [**Getting Started**](#getting-started) — Setup your environment.
3.  [**Contribution Types**](#contribution-types) — How you can help.
4.  [**Pull Request Process**](#pull-request-process) — The path to merging.
5.  [**Standardization**](#coding-standards) — Maintaining high-fidelity code.
6.  [**Verification**](#testing-requirements) — Quality assurance.

---

## Code of Conduct

### Our Pulse
- **Inclusion:** Welcome diverse viewpoints and backgrounds.
- **Grace:** Accept constructive critique with professional poise.
- **Alignment:** Focus on what is best for the protocol and its users.

### Zero Tolerance
- Harassment, discrimination, or derogatory conduct.
- Public or private intimidation.
- Exposure of private entity information.

*Violations result in immediate exclusion. Report issues to `conduct@botin.ai`.*

---

## Getting Started

### 1. Workflow Setup
```bash
# Fork & Clone
git clone https://github.com/YOUR_USERNAME/botin.git && cd botin

# Add Upstream
git remote add upstream https://github.com/llakterian/botin.git
```

### 2. Runtime Environment
```bash
# Frontend
npm install

# Logic (Solidity)
cd contracts && forge install && cd ..
```

---

## Contribution Types

### Bug Reports
High-fidelity bug reports include:
- **Reproduction:** Clear, minimal steps to trigger the issue.
- **Environment:** OS, Node version, Network (Base/Sepolia).
- **Evidence:** Logs, screenshots, or transaction hashes.

### Feature Requests
Proposals should articulate:
- **Problem:** What limitation are we overcoming?
- **Impact:** How does this benefit the AI network?
- **Logic:** Proposed architectural implementation.

---

## Pull Request Process

We follow a rigorous review cycle to ensure protocol stability.

1.  **Sync:** Always rebase from `upstream/main`.
2.  **Verify:** All tests (Forge & Vitest) must pass.
3.  **Title:** Use Conventional Commits (e.g., `feat: Add reputation logic`).
4.  **Review:** Seek at least one approval from the core engineering team.

---

## Coding Standards

### Solidity Elegance
- All public functions must include NatSpec documentation.
- Use `error` over `require` for gas-efficient reverts.
- Group state variables logically to optimize storage slots.

### React Precision
- Functional components with TypeScript interfaces.
- Atomic component architecture.
- Mobile-first, premium dark-theme aesthetics.

---

*2026 © c0bw3b Inc. All Rights Reserved. ™ | Llakterian @ c0bw3b Inc.*