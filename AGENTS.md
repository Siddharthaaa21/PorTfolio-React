# Workspace Agent Rules

## Autonomous Operation & Execution Guidelines
- **Autonomous Execution**: Execute commands, file modifications, test runs, and builds autonomously without pausing for manual confirmations on routine coding or verification tasks.
- **TDD Discipline**: Follow the strict Test-Driven Development cycle (Red -> Green -> Refactor). Run `npm test` and `npm run build` proactively.
- **Self-Correction**: Read test output, compiler diagnostics, and lint errors directly. Diagnose the root cause and apply fixes autonomously before requesting review.
- **Design Tokens**: Adhere to tokens in `portfolio-v2/src/styles/tokens.css`. Never use hardcoded hex colors or arbitrary spacing.
- **Contract Adherence**: Respect schema, event protocol, and boundaries defined in `.claude/contract.md`.
