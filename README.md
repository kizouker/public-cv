# Python Engineering Standard

This repository publishes Rickard Åberg's CV and a companion set of engineering standards for Python 3 projects. The standards are written for people and AI coding agents, but they are not agent prompts: they define the constraints and quality expectations for a project.

## Source of truth

The Markdown files in the repository are the source of truth for the standards. The [Code standards](code-standards.html) page renders those same files for web readers; it does not contain a second copy of the rules.

The standards are deliberately separated by responsibility:

| Document | Purpose |
| --- | --- |
| [`requirements-standard.md`](requirements-standard.md) | Define what the software must do and how requirements become testable. |
| [`code-standard.md`](code-standard.md) | Define how Python code and supporting configuration must be written. |
| [`folder-structure.md`](folder-structure.md) | Define where source, tests, tools, documentation and delivery configuration belong. |
| [`test-strategy.md`](test-strategy.md) | Define what to test, at which level, with which techniques, and why. |
| [`architecture-review.md`](architecture-review.md) | Define how structure, dependencies, security and trade-offs are reviewed. |

The documents describe standards, strategies and verification separately. A passing tool or test is evidence, not proof that every requirement is satisfied.

## Baseline

- Python 3 with [uv](https://docs.astral.sh/uv/) for environment and dependency management.
- English for source code, identifiers, commit-facing technical documentation and these standards.
- PEP 8 as the Python style baseline.
- Ruff for formatting and linting, `ty` for type checking, and `pytest`/`pytest-cov` for tests and coverage.
- Optional checks where the repository benefits from them: jscpd, import-linter or pydeps, and Gitleaks.
- pre-commit for fast local checks and GitHub Actions for reproducible CI.

## Development loop

1. Clarify the requirement and its acceptance criteria.
2. Create a failing test for new observable behaviour: **RED**.
3. Implement the smallest correct change: **GREEN**.
4. Refactor while keeping the relevant tests green: **REFACTOR**.
5. Run the local quality checks and review the result against the standards.
6. Perform the architecture and security review appropriate to the change.

## Local verification

The exact commands depend on the project, but a typical Python project should provide equivalent `uv` commands:

```text
uv run ruff format --check .
uv run ruff check .
uv run ty check
uv run pytest --cov --cov-report=term-missing
```

The static CV site itself has no build step. GitHub Pages serves the committed files directly through the workflow in `.github/workflows/pages.yml`.

## Scope note

This version intentionally does not include model-specific agent prompts. Prompts can later refer to these stable standards and add task-specific workflow, handover instructions and a maximum loop count without duplicating the rules here.
