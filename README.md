# Appwork Automation Task

Cypress E2E automation suite for [saucedemo.com](https://www.saucedemo.com), covering login, cart, checkout, and product sorting flows.

## 1. Tech Stack & Design Decisions

**Cypress + JavaScript + Page Object Model.** Cypress gives automatic retries, built-in waiting, and a fast headless runner, which keeps the suite reliable without hand-rolled polling. The Page Object Model (`cypress/support/pages/*.page.js`) keeps locators and interactions out of the spec files, so a UI change only needs a fix in one place, and specs read as plain user flows.

A few choices worth calling out:

- **One flat class per page**, no shared base-page abstraction. Each page object holds its own locators and asserts a concrete outcome (`be.visible`, `be.enabled`, `have.value`, `have.text`, URL changes) rather than trusting Cypress's default wait silently. This keeps failures easy to read — an assertion fails with the exact expected vs. actual value, not a generic "element not found." Timeouts rely on the global `defaultCommandTimeout` in `cypress.config.js` rather than being restated per call.
- **Shared interaction patterns live in `cypress/support/commands.js`**: `cy.clickWhenReady(selector)` (visible + enabled + click) and `cy.typeAndVerify(selector, value)` (type, then assert the value stuck) cover the two patterns repeated across every page object, so a new page object reuses them instead of copy-pasting the same three-line assertion chain.
- **Test tagging via [`@cypress/grep`](https://github.com/cypress-io/cypress-grep)**: each spec's `describe` block is tagged (`@Smoke`, `@Regression`), so suites can be run independently in CI or locally without splitting files by folder-per-suite.
- **Reporting via `mochawesome`**: each spec writes its own JSON report named after the spec file (`reportFilename: '[name]'` in `cypress.config.js`) instead of the reporter's default fixed filename — this matters once tests run in parallel (see CI below), otherwise every spec's report would collide and overwrite the last one.
- **Environment config lives in `.env`**, not in code. `baseUrl` (and anything else environment-specific) is read via `process.env.CYPRESS_BASE_URL` in `cypress.config.js`, so pointing the suite at a different environment is a config change, not a code change.

## 2. Prerequisites

- [Node.js](https://nodejs.org/) `^22 || ^24 || >=26` (matches Cypress's `engines` requirement — this repo was built/tested on Node 24)
- npm (ships with Node)
- [Docker](https://www.docker.com/) — only needed if you want to run the suite the same way CI does, in a container

## 3. Setup

```bash
git clone https://github.com/aashir1998/appwork-automation-task.git
cd appwork-automation-task
npm install
```

Create a `.env` file in the project root with:

```
CYPRESS_BASE_URL=https://www.saucedemo.com
```

Change this to point the suite at a different environment; no other code changes are required.

## 4. Running the Suite

| Command                   | What it does                                                                                                                                                                                                                               |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `npm test`                | **Single command for the full pipeline**: cleans old reports, runs every spec, then merges + generates the HTML report — even if a test fails — and exits with the real pass/fail code (see `scripts/run-tests.sh`). This is what CI runs. |
| `npm run test:smoke`      | Runs only specs/tests tagged `@Smoke` (no report step — see below)                                                                                                                                                                         |
| `npm run test:regression` | Runs only specs/tests tagged `@Regression` (no report step — see below)                                                                                                                                                                    |
| `npm run cy:run`          | Runs the full suite headless, no report generation step                                                                                                                                                                                    |
| `npm run cy:open`         | Opens the Cypress UI for interactive/debug runs                                                                                                                                                                                            |

`test:smoke`/`test:regression` only run Cypress (each spec still writes its own raw JSON under `cypress/reports/mocha/`) — they don't merge/generate the HTML report. Run `npm run report` afterward if you want the HTML report for a tagged subset, or filter by tag through the same full pipeline `npm test` uses:

```bash
npx cypress run --spec "cypress/e2e/auth/user-login.cy.js"
npx cypress run --expose grepTags=@Smoke --spec "cypress/e2e/**/*.cy.js"
```

### Running via Docker (matches CI exactly)

```bash
docker build -t appwork-cypress .
docker run --rm -v "$PWD/cypress/reports:/app/cypress/reports" appwork-cypress test
```

The image's entrypoint is `npm run`, so the trailing argument (`test`, `test:smoke`, `test:regression`, …) selects which script runs inside the container — same single-command behavior as running locally.

## 5. Viewing the Report

After any run that includes the report step (`npm test`, `npm run test:smoke`, `npm run test:regression`, or the Docker command above), open:

```
cypress/reports/html/index.html
```

in a browser for the full mochawesome HTML report (pass/fail per test, error stack traces, timings).

In CI, the merged report is uploaded as the `cypress-html-report` artifact on the GitHub Actions run — download it from the **Actions** tab → the run → **Artifacts**.

## 6. CI/CD (GitHub Actions)

`.github/workflows/cypress.yml` runs on push/PR to `master` and via manual dispatch:

1. **discover** — lists every `*.cy.js` spec so the matrix below always reflects whatever specs currently exist, with nothing to maintain by hand.
2. **build** — builds the test image once (`Dockerfile`, based on `cypress/base` rather than `cypress/included`, since only the default Electron browser is used) and pushes it to GHCR, so every parallel job below just pulls it instead of reinstalling dependencies.
3. **test** — runs each spec in its own parallel job (`docker run <image> cy:run -- --spec <spec>`), uploading raw JSON results (and screenshots on failure) as artifacts.
4. **report** — downloads all the raw JSON artifacts, merges them, and generates the final HTML report. This step runs on plain Node rather than pulling the Cypress image again, since merging JSON doesn't need Cypress at all.

**Required setup**: the `test` job reads `baseUrl` from a GitHub Actions repository variable, not from `.env` (which is gitignored and never reaches the runner/image). Before running the workflow on a fork or new repo, add it under **Settings → Secrets and variables → Actions → Variables → New repository variable**:

```
Name:  CYPRESS_BASE_URL
Value: https://www.saucedemo.com
```

## 7. Code Quality

- `npm run lint` — ESLint (`eslint-plugin-cypress` ruleset)
- `npm run format` — Prettier
- A Husky pre-commit hook runs `lint-staged`, auto-fixing lint/format issues on staged Cypress files before each commit.

## 8. Known Trade-offs & Future Improvements

- **Lint isn't enforced in CI.** `npm run lint` only runs locally via the Husky pre-commit hook (`lint-staged`), which is bypassable (`--no-verify`, or a clone where hooks were never installed). A dedicated `lint` job in `.github/workflows/cypress.yml` would close this gap without needing Docker.
- **Retries can mask flakiness.** `retries: { runMode: 1 }` means a test that fails once and passes on retry is reported as a plain pass, with no visible signal that it needed a retry. Fine for reducing CI noise, but worth pairing with a dashboard (see Cypress Cloud below) that surfaces retry counts rather than absorbing them silently.
- Use `cy.intercept()` to stub slow/flaky third-party requests and cut spec runtime further.
- Add visual regression coverage for the checkout flow.
- Push results to Cypress Cloud for cross-run analytics instead of only local/CI HTML reports — this would also give visibility into retried/flaky tests over time.
