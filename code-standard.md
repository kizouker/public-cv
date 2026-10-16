# Python Code Standard

This document defines how Python 3 code and its supporting configuration are written. It is the coding standard; the test and architecture documents define complementary strategies and reviews.

## Language and tooling

- Python 3 MUST be used. The supported minor versions MUST be explicit in project metadata and CI.
- `uv` SHOULD manage the project environment, lockfile and commands.
- Technical code, identifiers, comments, docstrings and repository documentation MUST use English.
- PEP 8 is the baseline for layout, imports, whitespace and readability.
- Ruff MUST be used for formatting and linting unless a documented project exception exists.
- `ty` SHOULD be used for static type checking. Public interfaces MUST have parameter and return annotations unless a deliberate exception is documented.
- pytest MUST be used for automated Python tests; pytest-cov SHOULD be used to measure coverage.

## Naming

- Repository and documentation directories and files SHOULD use `kebab-case`.
- Established names such as `README.md`, `LICENSE`, `pyproject.toml`, `.pre-commit-config.yaml` and files required by tools are exceptions.
- Python modules, functions, methods and variables MUST use `snake_case`.
- Python classes and exceptions MUST use `PascalCase`.
- Constants MUST use `UPPER_SNAKE_CASE`.
- Boolean names SHOULD read as predicates, such as `is_ready` or `has_access`.
- Names SHOULD express domain meaning. Avoid unexplained abbreviations and single-letter names outside short, conventional loops.

## Structure and design

- Each module MUST have a clear responsibility and a small public surface.
- Functions SHOULD do one coherent thing and keep branching and nesting understandable.
- Public interfaces MUST define their inputs, outputs, failure behaviour and side effects.
- Prefer simple composition and explicit dependencies over hidden global state, premature abstractions or framework magic.
- Imports MUST be grouped and unused imports MUST be removed. Circular dependencies MUST be avoided or explicitly justified.
- Dependency direction and module boundaries MUST follow [`folder-structure.md`](folder-structure.md) and be reviewed for meaningful changes.

## Types, errors and data

- Type annotations MUST describe the public contract, not merely silence a checker.
- Avoid `Any` at boundaries unless the value is validated immediately or the exception is documented.
- Catch the narrowest expected exception. Do not use a bare `except` for ordinary control flow.
- Error messages SHOULD explain the failed operation and safe corrective context; they MUST NOT disclose secrets or unnecessary personal data.
- Validate untrusted input at the boundary and keep validated data distinguishable from raw input.
- Configuration and secrets MUST come from the approved configuration mechanism or environment, never from committed source.

## Documentation and comments

- Public modules, classes and functions SHOULD have concise docstrings describing behaviour and important constraints.
- Comments MUST explain intent, invariants or non-obvious trade-offs. Do not use comments to preserve dead code.
- Examples and technical documentation MUST match the supported API and commands.

## Verification mapping

The following checks provide evidence for this standard:

| Concern | Preferred check |
| --- | --- |
| Formatting and common lint rules | Ruff format and Ruff check |
| Type contracts | `ty check` |
| Behaviour and regression safety | pytest |
| Coverage measurement | pytest-cov, interpreted with the test strategy |
| Duplicate code when useful | jscpd (optional) |
| Import/dependency boundaries | import-linter or pydeps (optional) |
| Accidental secrets | Gitleaks |
| Fast repeatable local checks | pre-commit |
| Reproducible shared checks | GitHub Actions CI |

Tools cannot judge every design choice, requirement or security property. A clean tool report MUST NOT be presented as proof that the standard or the requirements are fully satisfied.

## Exceptions

An exception MUST be local, intentional and documented with the reason, affected code and a follow-up if the exception is temporary. Do not weaken the standard globally to accommodate one difficult module.
