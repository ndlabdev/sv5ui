---
name: git-workflow
description: 'Git workflow automation: create feature/fix branches, run quality checks (format, lint, test), update CHANGELOG, merge to dev, and optionally prepare release branches. Follows GitFlow conventions.'
argument-hint: "<action> [args] — e.g. 'feature Collapsible', 'fix FileUpload drag bug', 'release 1.4.0', 'hotfix pin-input otp'"
user-invocable: true
---

# Git Workflow Skill

Automates the full git workflow for this project. The user provides an action and arguments.

## Actions

### 1. `feature <name>` — Start & complete a new feature

**Flow:** `dev` → `feat/<name>` → quality checks → merge back to `dev`

#### Steps:

1. **Branch creation**

    ```
    git checkout dev
    git pull origin dev
    git checkout -b feat/<kebab-case-name>
    ```

2. **After user confirms work is done**, run quality gates IN ORDER — stop on first failure:

    ```
    pnpm run format
    pnpm run lint
    pnpm run test
    ```

    If any step fails, fix the issues and re-run from that step.

3. **Stage & commit** (only project files, never `.env`, credentials, or `.claude/`):
    - Use conventional commit: `feat: add <Name> component` or `feat(<scope>): <description>`
    - Always include `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`

4. **Update CHANGELOG.md**:
    - Add entry under `[Unreleased]` → `### Added` section
    - One concise line per feature: `- **<Name>** — <description>`

5. **Merge to dev**:

    ```
    git checkout dev
    git merge feat/<name> --no-ff -m "Merge branch 'feat/<name>' into dev"
    git push origin dev
    ```

6. **Cleanup**: Delete local feature branch
    ```
    git branch -d feat/<name>
    ```

---

### 2. `fix <description>` — Bug fix

**Flow:** `dev` → `fix/<slug>` → quality checks → merge back to `dev`

#### Steps:

1. **Branch creation**

    ```
    git checkout dev
    git pull origin dev
    git checkout -b fix/<kebab-case-slug>
    ```

2. **After fix is done**, run quality gates (same as feature):

    ```
    pnpm run format
    pnpm run lint
    pnpm run test
    ```

3. **Stage & commit**:
    - Use conventional commit: `fix: <description>` or `fix(<scope>): <description>`

4. **Update CHANGELOG.md**:
    - If the fix is for a **new, unreleased** component (only exists under `[Unreleased]` → `### Added`), fold the fix into the existing Added entry — do NOT create `### Fixed`
    - If the fix is for an **already released** component (exists in a versioned section like `[1.3.0]`), add entry under `[Unreleased]` → `### Fixed`
    - A single fix branch may touch both new and released components — in that case, update Added for the new ones AND add Fixed entries for the released ones

5. **Merge to dev** (same as feature)

6. **Cleanup**: Delete local fix branch

---

### 3. `release <version>` — Prepare a release

**Flow:** `dev` → `release/<version>` → quality checks → version bump → merge to `dev` → push

#### Steps:

1. **Branch creation**

    ```
    git checkout dev
    git pull origin dev
    git checkout -b release/<version>
    ```

2. **Run full quality gates**:

    ```
    pnpm run format
    pnpm run lint
    pnpm run test
    ```

    ALL must pass — no exceptions.

3. **Version bump**:

    ```
    pnpm version <major|minor|patch> --no-git-tag-version
    ```

    Determine type automatically:
    - `major` — if CHANGELOG has `### Removed` or breaking changes
    - `minor` — if CHANGELOG has `### Added` (new features)
    - `patch` — if only `### Fixed` or `### Changed`

4. **Finalize CHANGELOG.md**:
    - Rename `[Unreleased]` to `[<version>] - <YYYY-MM-DD>`
    - Add new empty `[Unreleased]` section above
    - Add compare link at bottom: `[<version>]: https://github.com/ndlabdev/sv5ui/compare/v<prev>...v<version>`
    - Update `[Unreleased]` link: `[Unreleased]: https://github.com/ndlabdev/sv5ui/compare/v<version>...HEAD`

5. **Commit**:

    ```
    git add package.json CHANGELOG.md
    git commit -m "chore: release v<version>"
    ```

6. **Merge back to dev**:

    ```
    git checkout dev
    git merge release/<version> --no-ff -m "Merge branch 'release/<version>' into dev"
    git push origin dev
    ```

7. **Cleanup**: Delete local release branch

8. **Inform user**: "Release `v<version>` is ready on `dev`. Create a PR from `dev` → `main`, then after merge, tag with `git tag v<version>` and push the tag."

---

### 4. `hotfix <description>` — Urgent fix on production

**Flow:** `main` → `hotfix/<slug>` → quality checks → merge to BOTH `dev` and prepare for `main`

#### Steps:

1. **Branch creation**

    ```
    git checkout main
    git pull origin main
    git checkout -b hotfix/<kebab-case-slug>
    ```

2. **After fix is done**, run quality gates:

    ```
    pnpm run format
    pnpm run lint
    pnpm run test
    ```

3. **Version bump** (patch only):

    ```
    pnpm version patch --no-git-tag-version
    ```

4. **Update CHANGELOG.md** (same pattern as release)

5. **Commit**:

    ```
    git commit -m "fix: <description>"
    git commit -m "chore: release v<version>"
    ```

6. **Merge to dev**:

    ```
    git checkout dev
    git merge hotfix/<slug> --no-ff
    git push origin dev
    ```

7. **Inform user**: "Hotfix is on `dev`. Create a PR from `dev` → `main`, then tag `v<version>` after merge."

8. **Cleanup**: Delete local hotfix branch

---

### 5. `status` — Show current workflow state

Display:

- Current branch
- Uncommitted changes (`git status`)
- Branch relationship to dev/main
- Unreleased CHANGELOG entries
- Current version from `package.json`

---

### 6. `changelog <type> <entry>` — Add a CHANGELOG entry manually

Types: `added`, `changed`, `fixed`, `removed`

1. Read `CHANGELOG.md`
2. Add entry under `[Unreleased]` → `### <Type>` (create section if missing)
3. Commit: `docs: update CHANGELOG`

---

## Quality Gates

These checks run before EVERY merge. The order matters — fix each before proceeding:

| Step | Command           | What it checks                        |
| ---- | ----------------- | ------------------------------------- |
| 1    | `pnpm run format` | Code formatting (Prettier)            |
| 2    | `pnpm run lint`   | Lint errors (ESLint + Prettier check) |
| 3    | `pnpm run test`   | All unit tests pass (Vitest)          |

**If any gate fails:**

- Read the error output
- Fix the issue
- Re-run from the failed step
- Do NOT skip or force-pass

## Rules

- **NEVER** push directly to `main` — it is a protected branch
- **NEVER** use `--no-verify` or `--force`
- **NEVER** commit `.env`, credentials, or `.claude/` directory
- **ALWAYS** use `--no-ff` for merge commits to preserve branch history
- **ALWAYS** delete feature/fix branches after successful merge
- **ALWAYS** update CHANGELOG before merging
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/)
- Co-author line required: `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`
