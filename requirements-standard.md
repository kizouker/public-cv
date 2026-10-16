# Requirements Standard

This document defines how a Python project describes the behaviour and quality of the software it is building. It defines **what must be true**; it does not prescribe a particular implementation or test suite structure.

## Normative language

- **MUST** and **MUST NOT** are mandatory requirements.
- **SHOULD** and **SHOULD NOT** are strong defaults that need a recorded reason to change.
- **MAY** describes an allowed option.

## Requirement quality

Every non-trivial feature MUST have requirements that are:

- specific enough to guide implementation;
- observable through behaviour, an artefact or an explicit review;
- testable or accompanied by a documented reason why automation is not appropriate;
- traceable to acceptance criteria and, where useful, to a test or review record;
- independent of a particular class, module, framework or vendor unless that dependency is itself a requirement.

Avoid requirements such as “make it clean”, “use best practices” or “make it fast” without a measurable interpretation.

## Minimum requirement record

For each feature, record:

1. A stable identifier, such as `REQ-042`.
2. The user, system or business outcome.
3. The required behaviour and important constraints.
4. Inputs, outputs and externally visible side effects.
5. Error, boundary and unavailable-dependency behaviour.
6. Security, privacy and data-retention implications.
7. Acceptance criteria that describe observable outcomes.

A useful form is:

```text
ID: REQ-042
Statement: The service MUST reject an expired access token with HTTP 401.
Acceptance: Given an expired token, when the protected endpoint is called,
            then no protected data is returned and the response is 401.
```

## Functional requirements

Functional requirements MUST describe the behaviour of the system, including:

- valid and invalid input;
- normal results and side effects;
- ordering, idempotency and retry behaviour where relevant;
- failure modes and user-visible errors;
- compatibility rules for public APIs, files, messages or persisted data.

## Non-functional requirements

Record quality attributes when they materially affect the design:

- security and privacy;
- availability and recoverability;
- performance and resource limits;
- accessibility and usability;
- observability and auditability;
- portability and supported Python/runtime versions;
- maintainability and operational cost.

Each quality requirement SHOULD include a measure, threshold or review criterion. A requirement such as “the endpoint is responsive” is incomplete; a target latency under a named load is actionable.

## Acceptance and traceability

Acceptance criteria MUST be written before implementation is considered complete. They SHOULD cover the happy path, invalid input, important boundaries and relevant security cases.

Traceability MAY be lightweight. A small change can link a requirement to a test name; a larger change SHOULD also record design decisions, affected interfaces and review evidence. Missing automation MUST be visible rather than silently implied by a coverage percentage.

## Change control

When a requirement changes, review its effect on:

- existing behaviour and backward compatibility;
- tests, fixtures and test data;
- security and privacy assumptions;
- architecture and dependencies;
- documentation and operational procedures.

Do not change a requirement merely to make an implementation or a failing test appear compliant. If the intended behaviour changes, update the requirement, acceptance criteria and tests together.
