# Test Strategy

This document defines what to test, why to test it and how to interpret the evidence. Tests demonstrate selected behaviour; they do not prove that all requirements or risks have been covered.

## Principles

- New behaviour SHOULD follow **RED → GREEN → REFACTOR**.
- Tests MUST assert observable behaviour and meaningful contracts, not private implementation details unless the private invariant is itself important.
- A test suite MUST be deterministic, isolated and understandable.
- Failures MUST be investigated; do not weaken an assertion or increase a timeout just to make CI green.
- Test data MUST be synthetic or appropriately anonymised. Secrets and unnecessary personal data MUST NOT appear in fixtures or logs.

### TDD loop

1. **RED:** write the smallest test that expresses the missing behaviour and confirm it fails for the expected reason.
2. **GREEN:** implement the smallest correct change and confirm the test passes.
3. **REFACTOR:** improve structure, naming and duplication while keeping the relevant tests green.

An existing project setup that is already green is not expected to be made artificially red. The RED step applies to new or changed behaviour.

## Test levels

Use the lowest level that provides convincing evidence, then add higher-level tests for integration risk.

1. **Unit:** one function or small class with collaborators isolated. Fast feedback for calculations, parsing and validation.
2. **Component:** a cohesive module or service with selected real collaborators and controlled external boundaries.
3. **System integration:** multiple deployed or assembled components communicating through real protocols, storage or queues.
4. **System functional:** an end-to-end business capability through the system boundary, with infrastructure kept as realistic as practical.
5. **End-to-end:** a user or external actor journey across the complete deployed product. Keep these few, stable and risk-focused.

Do not call a test an integration test merely because it uses a fixture. Name the level according to the boundary and collaborators actually exercised.

## Test techniques

- **Black-box:** derive cases from requirements and public contracts without relying on implementation structure.
- **White-box:** use knowledge of branches, states and failure paths to target internal risk.
- **Grey-box:** combine public behaviour with limited knowledge of data flow, persistence or deployment boundaries.

Use equivalence classes, boundary values, state transitions, error guessing and property-style examples where they reveal risk. Techniques complement test levels; they are not extra levels.

## Coverage and quality

`pytest-cov` SHOULD report line and branch coverage where supported. A project MAY set an initial target such as 80%, but the target MUST be interpreted alongside risk and test quality.

Coverage is a measurement of executed code, not proof of correctness. High coverage can still miss incorrect assertions, invalid requirements, bad test data, security failures and production configuration problems. A lower number can be acceptable when excluded code and residual risk are explicit.

## API and contract testing

HTTP and message APIs SHOULD have contract tests covering:

- status codes, schemas and content types;
- valid, invalid and boundary input;
- authentication, authorisation and safe error responses;
- idempotency, retries and compatibility where relevant;
- backward-compatible changes to public payloads.

Use OpenAPI or an equivalent explicit contract when the interface warrants it. Contract validation complements, but does not replace, functional and security tests.

## Fixtures and environments

- Fixtures SHOULD be small, named by behaviour and scoped to the narrowest useful lifetime.
- Tests MUST clean up external state or use isolated resources.
- Time, randomness, network calls and environment variables SHOULD be controllable at test boundaries.
- External services MUST be replaced with contract-faithful fakes in unit tests and exercised for real at an appropriate integration level.
- Retries and eventual consistency MUST be tested deliberately rather than hidden behind long sleeps.

## Security testing

Security-focused tests SHOULD cover input validation, access control, secret handling, injection-sensitive boundaries, data exposure, secure defaults and failure behaviour. Use relevant OWASP guidance and the threat model for the project.

Automated tests are necessary but not sufficient for security. Threat modelling, dependency review and manual inspection remain required for material changes.

## Automation and gates

Local checks SHOULD run through `uv` and pre-commit. CI SHOULD run the same essential checks in a clean environment, including Ruff, `ty`, pytest and security scanning where configured. Optional tools such as jscpd, import-linter or pydeps should be enabled when their signal justifies their cost.

Every test failure is a release signal until it is understood. Skips, quarantines and exclusions MUST be documented with an owner or review date when they are not permanent by design.
