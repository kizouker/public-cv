# Folder Structure Standard

The structure below is the default for a Python 3 project. A small project MAY omit empty areas, but a different layout MUST have a reason that is recorded in the project documentation or architecture review.

```text
project-name/
├── README.md
├── pyproject.toml
├── uv.lock
├── .pre-commit-config.yaml
├── .gitignore
├── src/
│   └── package_name/
├── tests/
│   ├── unit/
│   ├── component/
│   ├── integration/
│   ├── functional/
│   └── e2e/
├── docs/
├── tools/
└── .github/
    └── workflows/
```

## Responsibilities

- `src/` contains importable application or library code. The package directory MUST use `snake_case`.
- `tests/` contains automated tests and fixtures. Test names SHOULD describe behaviour rather than implementation details.
- `docs/` contains project-facing documentation, decisions and operational notes. Standards MAY live at the repository root when they are intended to be consumed as repository-wide rules.
- `tools/` contains small, project-specific scripts that are not runtime application code.
- `.github/workflows/` contains CI and delivery workflows. Workflow names SHOULD make their trigger and purpose obvious.
- `pyproject.toml` is the central project and tool configuration file where the tools support that convention.
- `uv.lock` MUST be committed for applications and other reproducible environments.

## Boundaries

- Runtime code MUST NOT import from `tests/` or `tools/`.
- Tests MAY import public application interfaces and dedicated test helpers; they SHOULD avoid reaching into private implementation details.
- Delivery configuration MUST NOT contain application secrets.
- Generated files, caches, virtual environments and local credentials MUST be ignored and MUST NOT be committed.
- Documentation links MUST remain valid after moves; update references in the same change.

## Small projects and migrations

A small script MAY start with a flat layout. Move to `src/` and layered test directories when the project gains multiple modules, external consumers, or meaningful deployment risk. The move SHOULD be mechanical and accompanied by import/test verification rather than mixed with unrelated feature work.

## Naming exceptions

Use `kebab-case` for new repository and documentation paths, except for established tool-required names and Python package/module names, which use `snake_case`. Do not rename a standard tool file merely to satisfy the general naming rule.
