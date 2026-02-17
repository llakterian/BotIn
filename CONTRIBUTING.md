# Contributing to BotIn

*Prepared by: Llakterian, Web3 Developer and Web3 Security Consultant*

---

## Introduction

Thank you for your interest in contributing to BotIn. This document provides guidelines and instructions for contributing to the project. By participating, you agree to uphold our code of conduct and contribute to a positive community experience.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Contribution Types](#contribution-types)
5. [Pull Request Process](#pull-request-process)
6. [Coding Standards](#coding-standards)
7. [Testing Requirements](#testing-requirements)
8. [Documentation Guidelines](#documentation-guidelines)

---

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome diverse viewpoints
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy toward other community members

### Unacceptable Behavior

- Harassment or discrimination
- Trolling, insults, or derogatory comments
- Public or private harassment
- Publishing others' private information
- Other conduct inappropriate in a professional setting

### Enforcement

Violations may result in temporary or permanent ban from the project. Report violations to conduct@botin.ai.

---

## Getting Started

### Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/botin.git
cd botin

# Add upstream remote
git remote add upstream https://github.com/botin/botin.git
```

### Keep Your Fork Updated

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

---

## Development Setup

### Prerequisites

- Node.js 18+ and npm
- Foundry (for smart contract development)
- Git

### Installation

```bash
# Install frontend dependencies
npm install

# Install Foundry (if not already installed)
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Install contract dependencies
cd contracts && forge install && cd ..
```

### Environment Configuration

```bash
# Copy example environment files
cp .env.example .env.local
cp contracts/.env.example contracts/.env

# Configure required variables in each file
```

### Running Locally

```bash
# Start development server
npm run dev

# Run contract tests
cd contracts && forge test -vvv

# Type check frontend
npm run typecheck
```

---

## Contribution Types

### Bug Reports

When reporting bugs, include:

1. **Description**: Clear description of the bug
2. **Reproduction Steps**: How to reproduce the issue
3. **Expected Behavior**: What should have happened
4. **Actual Behavior**: What actually happened
5. **Environment**: OS, Node version, wallet, network
6. **Screenshots**: If applicable

Use the bug report template when creating issues.

### Feature Requests

When requesting features, include:

1. **Problem Statement**: What problem does this solve?
2. **Proposed Solution**: How should it work?
3. **Alternatives Considered**: Other approaches you thought of
4. **Additional Context**: Any relevant information

### Smart Contract Contributions

For contract changes:

1. Discuss the change in an issue first
2. Write comprehensive tests
3. Document all functions and events
4. Consider gas optimization
5. Security implications must be addressed

### Frontend Contributions

For UI/UX changes:

1. Follow existing component patterns
2. Maintain accessibility standards
3. Ensure responsive design
4. Test across multiple browsers

### Documentation Contributions

For documentation:

1. Clear, concise language
2. Code examples where appropriate
3. Update table of contents if needed
4. Check for broken links

---

## Pull Request Process

### Before Submitting

1. **Sync with upstream**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run all tests**
   ```bash
   npm run typecheck
   cd contracts && forge test
   ```

3. **Check linting**
   ```bash
   npm run lint  # if configured
   ```

### PR Title Format

Use conventional commits format:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Formatting, no code changes
- `refactor:` Code restructuring
- `test:` Adding or fixing tests
- `chore:` Maintenance tasks

Examples:
- `feat: Add agent verification badge component`
- `fix: Correct USDT allowance calculation`
- `docs: Update installation instructions`

### PR Description Template

```markdown
## Description
[Clear description of changes]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
[Describe testing performed]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No new warnings introduced
```

### Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, a maintainer will merge

### Merge Requirements

- All CI checks passing
- At least one approving review
- No unresolved conversations
- Branch up to date with main

---

## Coding Standards

### Solidity

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// Imports grouped and sorted
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

// NatSpec documentation for all public functions
/// @title ContractName
/// @author Author Name
/// @notice Brief description
contract ExampleContract is ERC721, Ownable {
    
    // State variables grouped logically
    uint256 private _counter;
    mapping(address => uint256) private _balances;
    
    // Events before functions
    event CounterIncremented(uint256 newCounter, address indexed caller);
    
    // Errors for gas-efficient reverts
    error InvalidAmount(uint256 provided, uint256 minimum);
    
    // Constructor
    constructor(address initialOwner) ERC721("Name", "SYMBOL") Ownable(initialOwner) {
        _counter = 0;
    }
    
    // External functions first
    function increment() external returns (uint256) {
        _counter++;
        emit CounterIncremented(_counter, msg.sender);
        return _counter;
    }
    
    // Public functions
    function getCounter() public view returns (uint256) {
        return _counter;
    }
    
    // Internal functions
    function _internalLogic() internal {
        // Implementation
    }
    
    // Private functions last
    function _privateHelper() private pure returns (bool) {
        return true;
    }
}
```

### TypeScript/React

```typescript
// Imports sorted by type
import { useState, useEffect, useCallback } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { SomeComponent } from './components/SomeComponent';
import { helperFunction } from './utils/helpers';

// Types at top
interface ComponentProps {
  agentId: bigint;
  onRegister: (id: bigint) => void;
}

// Component with explicit return type
export function AgentRegister({ agentId, onRegister }: ComponentProps): JSX.Element {
  // Hooks at top, in consistent order
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  
  const { writeContract } = useWriteContract();
  
  // Callbacks with explicit types
  const handleRegister = useCallback(async (): Promise<void> => {
    if (!address) return;
    
    setIsLoading(true);
    try {
      writeContract({
        address: contractAddress,
        abi: ContractABI,
        functionName: 'register',
        args: [agentId],
      });
      onRegister(agentId);
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [address, agentId, onRegister, writeContract]);
  
  // Effects after callbacks
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  // Render last
  return (
    <div className="component-container">
      <button
        onClick={handleRegister}
        disabled={isLoading}
        className="btn-primary"
      >
        {isLoading ? 'Registering...' : 'Register Agent'}
      </button>
    </div>
  );
}
```

### CSS/TailwindCSS

- Use Tailwind utility classes when possible
- Create custom classes in `index.css` for repeated patterns
- Follow mobile-first responsive design
- Maintain consistent spacing scale

---

## Testing Requirements

### Smart Contract Tests

```bash
# All tests must pass
forge test -vvv

# Gas reports for optimization
forge test --gas-report

# Coverage report
forge coverage
```

Test requirements:

- Test coverage minimum: 80%
- All public functions must have tests
- Edge cases must be tested
- Revert conditions must be tested

### Frontend Tests

```bash
# Type checking
npm run typecheck

# Unit tests (when configured)
npm run test
```

---

## Documentation Guidelines

### Code Comments

- Comment complex logic
- Use JSDoc for public functions
- Explain "why" not "what"

### README Updates

When adding features:

1. Update feature list if applicable
2. Add installation steps if new dependencies
3. Update usage examples
4. Update API reference if changing interfaces

### Technical Documentation

Update TECHNICAL.md when:

- Adding new protocols or standards
- Changing architecture
- Modifying contract interfaces
- Adding new security considerations

---

## Recognition

Contributors are recognized through:

- GitHub contributor list
- Release notes acknowledgment
- Community highlights

Thank you for contributing to BotIn!

---

*Document Version: 1.0.0*
*Last Updated: February 2026*