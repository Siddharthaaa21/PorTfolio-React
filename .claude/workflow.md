# Dynamic TDD Multi-Agent Workflow

This workflow orchestrates agile, branch-isolated development driven by Test-Driven Development (TDD).

```mermaid
flowchart TD
    UserReq(["User Request / Feature Goal"]) --> MP["1. Milestone Planner"]
    
    MP -- "Milestone Specs & Prompts" --> TDD["2. TDD Developer (Branch Workspace)"]
    
    subgraph TDD_Loop ["Strict TDD Cycle (Branch)"]
        TDD --> Red["Phase 1: RED (Write Failing Tests)"]
        Red --> Green["Phase 2: GREEN (Implement Minimum Code)"]
        Green --> Refactor["Phase 3: REFACTOR (Clean & Verify)"]
        Refactor --> TestPass["All Tests Pass (npm test)"]
    end
    
    TestPass --> QA["3. QA & Contract Validator"]
    
    QA -- "PASS (Tests + Build + Contract Green)" --> Merge["Merge to Main & Deploy"]
    QA -- "FAIL (Issues Found)" --> TDD
```

---

## The 3-Agent Lifecycle

### 1. Milestone Planner (`milestone-planner`)
- Breaks goals down into atomic, sequential milestones.
- Formulates acceptance criteria and test expectations before any code is written.
- Generates targeted prompts for branch builder agents.

### 2. TDD Developer (`tdd-developer`)
- Spawns in an isolated git branch / workspace.
- **Red**: Writes tests in `src/**/__tests__/*.test.{js,jsx}` covering happy paths, edge cases, and guardrails.
- **Green**: Implements feature logic until `npm test` passes 100%.
- **Refactor**: Cleans up duplication, verifies styling tokens, and ensures zero build regressions.

### 3. QA & Contract Validator (`qa-validator`)
- Executes the full test suite (`npm test`) and build verification (`npm run build`).
- Audits contract adherence and logs achievements in `.claude/progress.md`.
- Approves merge to `main`.
