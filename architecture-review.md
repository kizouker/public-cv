# Architecture Review Standard

Architecture review is a structured check of the system's boundaries, dependencies and quality attributes. It is not a search for a fashionable pattern and it is not replaced by linting or passing tests.

## When to review

Review architecture when a change:

- introduces a new service, datastore, framework or external integration;
- changes public APIs, message contracts or persistence;
- changes trust boundaries, authentication, authorisation or sensitive data flow;
- adds a cross-cutting abstraction or materially changes dependency direction;
- creates a new operational, availability, performance or recovery risk.

Small local changes MAY use a lightweight checklist. The decision and relevant evidence SHOULD still be visible in the change record.

## Review questions

### Responsibilities and boundaries

- Is each component responsible for a coherent capability?
- Are public interfaces explicit about inputs, outputs, errors and side effects?
- Is the proposed abstraction justified by current requirements rather than imagined reuse?
- Can the design be changed or tested without changing unrelated components?

### Dependencies and data flow

- Do dependencies point in an intentional direction?
- Are external systems isolated behind clear adapters or contracts?
- Where is data validated, transformed, persisted and deleted?
- Are retries, timeouts, idempotency and partial failure defined?
- Are import and runtime dependency cycles prevented?

### Quality attributes

Consider the quality attributes affected by the change:

- security and privacy;
- availability, recovery and operability;
- performance, capacity and cost;
- accessibility and usability;
- portability, maintainability and testability.

The review SHOULD record the important trade-offs, not just a component diagram.

### Security and privacy

- What are the assets, actors and trust boundaries?
- What happens if input, credentials or a dependency is malicious or unavailable?
- Are least privilege, secret handling, logging and data retention appropriate?
- Could errors, metrics or traces expose sensitive information?

## Evidence

Useful evidence includes a small context or sequence diagram, an API/schema contract, dependency analysis, tests at affected levels, performance measurements, threat-model notes and an ADR for decisions that are difficult to reverse.

Automated evidence MAY include Ruff, `ty`, pytest, coverage, import-linter or pydeps, dependency scanners and Gitleaks. These checks support the review; none can decide whether the architecture is fit for the requirements.

## Outcomes

Record one of:

- **Approved:** the design and risks are acceptable.
- **Approved with follow-up:** the change is acceptable with named, bounded follow-up work.
- **Revise:** a material requirement, risk or boundary is unresolved.
- **Rejected:** the design cannot meet the requirements or risk tolerance.

An exception MUST identify the affected requirement or standard, the reason, the risk accepted and who should revisit it. Repeated exceptions indicate that the architecture or standard needs a deliberate change.
