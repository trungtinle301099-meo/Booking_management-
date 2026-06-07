# Booking Management API Automation — Playwright + TypeScript + Allure

Professional API automation framework for [Restful Booker](https://restful-booker.herokuapp.com), built with **Playwright + TypeScript + Service Layer + Custom Fixtures + Allure Report**.

This project is designed for testing the Booking Management API, including:

* Auth - Create Token
* Booking - Get Booking IDs
* Booking - Get Booking Detail
* Booking - Create Booking
* Booking - Update Booking
* Booking - Partial Update Booking
* Booking - Delete Booking

---

## Tech Stack

| Tool              | Purpose                                                                         |
| ----------------- | ------------------------------------------------------------------------------- |
| Playwright Test   | API test runner and assertion framework                                         |
| TypeScript        | Type safety and maintainable automation source                                  |
| Node.js           | Runtime environment                                                             |
| dotenv            | Environment variable management                                                 |
| Zod               | API response schema validation                                                  |
| ESLint            | Code quality and static analysis                                                |
| Prettier          | Code formatting                                                                 |
| Allure Playwright | Rich test report integration                                                    |
| allure-js-commons | Add Epic, Feature, Story, Severity, Owner, Tags, Steps, Parameters, Attachments |
| GitHub Actions    | CI pipeline and Allure Report publishing                                        |
| GitHub Pages      | Publish Allure HTML report online                                               |

---

## Prerequisites

Before running this project, make sure your machine has:

* **Node.js 20+**
* **npm**
* **Git**
* A terminal such as macOS Terminal, VS Code Terminal, Git Bash, or Linux shell

Verify your setup:

```bash
node -v
npm -v
git --version
```

Expected:

```text
node v20.x.x or higher
npm 10.x.x or higher
git 2.x.x or higher
```

---

## Repository

```bash
git clone https://github.com/trungtinle301099-meo/Booking_management-.git
cd Booking_management-
```

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/trungtinle301099-meo/Booking_management-.git

# 2. Go to project root
cd Booking_management-

# 3. Install dependencies
npm install

# 4. Copy environment file
cp .env.example .env

# 5. Run TypeScript check
npm run type-check

# 6. Run lint check
npm run lint

# 7. Run format check
npm run format:check

# 8. Run API tests
npm run test:api

# 9. Generate Allure report
npm run allure:generate

# 10. Open Allure report
npm run allure:open
```

---

## Environment Variables

This project uses `.env` to manage environment values.

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Example `.env`:

```env
BASE_URL=https://restful-booker.herokuapp.com
BOOKING_USERNAME=admin
BOOKING_PASSWORD=password123
```

| Variable           | Required | Description                          |
| ------------------ | -------: | ------------------------------------ |
| `BASE_URL`         |      Yes | Base API URL for Restful Booker      |
| `BOOKING_USERNAME` |      Yes | Username used to generate auth token |
| `BOOKING_PASSWORD` |      Yes | Password used to generate auth token |

> Do not commit real secret values into GitHub. `.env` should be ignored by Git.

---

## Available Scripts

| Script                    | Command                               | Purpose                                       |
| ------------------------- | ------------------------------------- | --------------------------------------------- |
| `npm run test`            | `playwright test`                     | Run all Playwright tests                      |
| `npm run test:api`        | `playwright test tests/api`           | Run all API tests                             |
| `npm run test:auth`       | `playwright test tests/api/auth`      | Run Auth API tests only                       |
| `npm run test:booking`    | `playwright test tests/api/booking`   | Run Booking API tests only                    |
| `npm run test:report`     | `playwright show-report`              | Open Playwright HTML report                   |
| `npm run type-check`      | `tsc --noEmit`                        | Run TypeScript type checking                  |
| `npm run lint`            | `eslint .`                            | Run ESLint check                              |
| `npm run format`          | `prettier . --write`                  | Format source code                            |
| `npm run format:check`    | `prettier . --check`                  | Check code format                             |
| `npm run check`           | type-check + lint + format + API test | Run full quality gate                         |
| `npm run allure:clean`    | remove Allure artifacts               | Clean old Allure results/report               |
| `npm run test:allure`     | clean + run all tests                 | Run all tests and generate Allure raw results |
| `npm run test:api:allure` | clean + run API tests                 | Run API tests and generate Allure raw results |
| `npm run allure:metadata` | generate Allure metadata              | Add environment, executor, and categories     |
| `npm run allure:generate` | generate Allure HTML report           | Build report from `allure-results`            |
| `npm run allure:open`     | open Allure report                    | Open generated Allure HTML report             |
| `npm run allure:serve`    | serve Allure report                   | Serve report from raw results                 |
| `npm run report:allure`   | generate + open report                | Generate and open report locally              |
| `npm run security:audit`  | npm audit                             | Check dependency vulnerabilities              |

---

## Project Structure

```text
Booking_management-/
├── src/
│   ├── api/
│   │   ├── clients/
│   │   │   └── api-client.ts
│   │   │
│   │   ├── endpoints/
│   │   │   ├── auth.endpoint.ts
│   │   │   └── booking.endpoint.ts
│   │   │
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   └── booking.service.ts
│   │   │
│   │   └── assertions/
│   │       └── response.assertion.ts
│   │
│   ├── config/
│   │   └── env.config.ts
│   │
│   ├── data/
│   │   ├── auth.data.ts
│   │   └── booking.data.ts
│   │
│   ├── fixtures/
│   │   └── api.fixture.ts
│   │
│   ├── helpers/
│   │   ├── allure.helper.ts
│   │   ├── token.helper.ts
│   │   └── random.helper.ts
│   │
│   ├── schemas/
│   │   └── booking.schema.ts
│   │
│   └── types/
│       ├── auth.type.ts
│       └── booking.type.ts
│
├── tests/
│   └── api/
│       ├── auth/
│       │   └── login.api.spec.ts
│       └── booking/
│           └── update-partial-booking.api.spec.ts
│
├── scripts/
│   └── allure-metadata.js
│
├── .github/
│   └── workflows/
│       └── allure-report.yml
│
├── .env
├── .env.example
├── .gitignore
├── .prettierrc
├── .prettierignore
├── eslint.config.mjs
├── package.json
├── package-lock.json
├── playwright.config.ts
└── tsconfig.json
```

---

## Folder and File Explanation

| Folder/File                           | Purpose                                                                        |
| ------------------------------------- | ------------------------------------------------------------------------------ |
| `src/api/clients`                     | Shared API client wrapper for GET, POST, PUT, PATCH, DELETE                    |
| `src/api/endpoints`                   | Centralized API endpoint definitions                                           |
| `src/api/services`                    | Service layer containing business API actions                                  |
| `src/api/assertions`                  | Reusable API response assertions                                               |
| `src/config`                          | Environment configuration reader                                               |
| `src/data`                            | Test data for auth and booking APIs                                            |
| `src/fixtures`                        | Custom Playwright fixtures injecting services into tests                       |
| `src/helpers`                         | Shared helper functions such as token generation, random data, Allure metadata |
| `src/schemas`                         | Zod schemas for validating API response body                                   |
| `src/types`                           | TypeScript request/response types                                              |
| `tests/api`                           | Actual API test specs                                                          |
| `scripts/allure-metadata.js`          | Generates Allure environment, executor, and defect categories                  |
| `playwright.config.ts`                | Playwright test runner configuration                                           |
| `tsconfig.json`                       | TypeScript compiler configuration                                              |
| `eslint.config.mjs`                   | ESLint quality rules                                                           |
| `.prettierrc`                         | Prettier formatting rules                                                      |
| `.prettierignore`                     | Files/folders ignored by Prettier                                              |
| `.github/workflows/allure-report.yml` | GitHub Actions workflow for API tests and Allure publishing                    |

---

## Architecture Overview

This project follows a clean API automation architecture:

```text
Test Spec
  ↓
Custom Fixture
  ↓
Service Layer
  ↓
API Client
  ↓
Endpoint Layer
  ↓
Restful Booker API
```

### Why this architecture?

| Layer          | Benefit                                              |
| -------------- | ---------------------------------------------------- |
| Test Spec      | Keeps test cases readable and business-focused       |
| Fixture        | Injects reusable services into tests                 |
| Service Layer  | Reuses API actions and avoids duplicate request code |
| API Client     | Centralizes HTTP methods                             |
| Endpoint Layer | Avoids hardcoded API URLs in tests                   |
| Data Layer     | Keeps payloads maintainable                          |
| Schema Layer   | Validates API contract                               |
| Allure Helper  | Adds professional test report metadata               |

---

## API Coverage

Current automated API coverage:

| Module  | API                            | Method                | Status                    |
| ------- | ------------------------------ | --------------------- | ------------------------- |
| Auth    | Create Token                   | `POST /auth`          | Covered                   |
| Booking | Partial Update Booking         | `PATCH /booking/:id`  | Covered                   |
| Booking | Create Booking as precondition | `POST /booking`       | Covered inside PATCH flow |
| Booking | Get Booking IDs                | `GET /booking`        | Not yet                   |
| Booking | Get Booking Detail             | `GET /booking/:id`    | Not yet                   |
| Booking | Full Update Booking            | `PUT /booking/:id`    | Not yet                   |
| Booking | Delete Booking                 | `DELETE /booking/:id` | Not yet                   |

Recommended next automation flow:

```text
Create Booking → Get Booking → Update Booking → Partial Update Booking → Delete Booking
```

---

## Running Tests

### Run all tests

```bash
npm run test
```

### Run all API tests

```bash
npm run test:api
```

### Run Auth API tests only

```bash
npm run test:auth
```

### Run Booking API tests only

```bash
npm run test:booking
```

### Run a specific test file

```bash
npx playwright test tests/api/auth/login.api.spec.ts
npx playwright test tests/api/booking/update-partial-booking.api.spec.ts
```

### Run tests by title keyword

```bash
npx playwright test --grep "AUTH_001"
npx playwright test --grep "BOOKING_PATCH_001"
```

### Run tests in debug mode

```bash
npx playwright test --debug
```

---

## Code Quality Checks

Before pushing code, always run:

```bash
npm run type-check
npm run lint
npm run format:check
npm run test:api
```

Or run the full quality gate:

```bash
npm run check
```

If format check fails:

```bash
npm run format
npm run format:check
```

If lint can be auto-fixed:

```bash
npm run lint -- --fix
```

---

## Playwright HTML Report

After running tests, open Playwright HTML report:

```bash
npm run test:report
```

The report is generated in:

```text
playwright-report/
```

This folder is ignored by Git.

---

## Allure Report

This project includes professional Allure Report support.

Allure raw results are generated in:

```text
allure-results/
```

Allure HTML report is generated in:

```text
allure-report/
```

Both folders are ignored by Git.

---

## Generate Allure Report Locally

Run API tests with Allure:

```bash
npm run test:api:allure
```

Generate Allure HTML report:

```bash
npm run allure:generate
```

Open Allure report:

```bash
npm run allure:open
```

Or run generate and open together:

```bash
npm run report:allure
```

If `allure:open` does not work on macOS, open directly:

```bash
open allure-report/index.html
```

---

## Allure Report Data

The test cases are enriched using `allure-js-commons`.

Current Allure report includes:

| Allure Field | Example                                                                    |
| ------------ | -------------------------------------------------------------------------- |
| Epic         | `Booking Management API`                                                   |
| Feature      | `Auth API`, `Booking API`                                                  |
| Story        | `Create Token`, `Partial Update Booking`                                   |
| Severity     | `critical`, `normal`                                                       |
| Owner        | `trungtinle`                                                               |
| Tags         | `api`, `auth`, `booking`, `positive`, `negative`, `security`, `regression` |
| Parameters   | `endpoint`, `testType`, `baseUrl`, `authType`, `bookingId`                 |
| Steps        | Step-by-step execution logs                                                |
| Attachments  | Request body, response body, unauthorized response                         |
| Categories   | Schema defect, auth defect, status defect, timeout issue                   |

---

## How to Write a New API Test

When writing a new API test, follow this structure:

```ts
import { test, expect } from '../../../src/fixtures/api.fixture';
import {
  addJsonAttachment,
  addAllureParameter,
  allureStep,
  setAllureApiMetadata,
  Severity,
} from '../../../src/helpers/allure.helper';

test.describe('[Module API] Feature Name', () => {
  test('TEST_ID - should do something successfully', async ({ bookingService }) => {
    await setAllureApiMetadata({
      epic: 'Booking Management API',
      feature: 'Booking API',
      story: 'Create Booking',
      owner: 'trungtinle',
      severity: Severity.CRITICAL,
      tags: ['api', 'booking', 'positive'],
      description: 'Verify that user can create booking successfully.',
    });

    await addAllureParameter('endpoint', 'POST /booking');
    await addAllureParameter('testType', 'Positive');

    const response = await allureStep('Send API request', async () => {
      return bookingService.createBooking({
        firstname: 'Jim',
        lastname: 'Brown',
        totalprice: 111,
        depositpaid: true,
        bookingdates: {
          checkin: '2026-01-01',
          checkout: '2026-01-05',
        },
        additionalneeds: 'Breakfast',
      });
    });

    const body = await allureStep('Parse response body', async () => {
      const responseBody = await response.json();
      await addJsonAttachment('Response Body', responseBody);
      return responseBody;
    });

    await allureStep('Verify response data', async () => {
      expect(response.status()).toBe(200);
      expect(body).toHaveProperty('bookingid');
    });
  });
});
```

---

## Test Case Naming Convention

Use this naming convention:

```text
<MODULE>_<ACTION>_<NUMBER> - should <expected behavior>
```

Examples:

```text
AUTH_001 - should create token successfully with valid credential
AUTH_002 - should not create valid token with invalid credential
BOOKING_PATCH_001 - should partially update booking firstname and lastname successfully
BOOKING_PATCH_002 - should not partially update booking without auth token
BOOKING_CREATE_001 - should create booking successfully with valid payload
BOOKING_DELETE_001 - should delete booking successfully with valid token
```

---

## Recommended Test Types

When adding new API tests, cover:

| Test Type        | Example                                            |
| ---------------- | -------------------------------------------------- |
| Positive         | Create booking with valid payload                  |
| Negative         | Create booking with missing required field         |
| Validation       | Invalid data type for `totalprice`                 |
| Boundary         | Very large `totalprice`, empty string, long string |
| Auth/Security    | Missing token, invalid token                       |
| Schema           | Response body matches expected schema              |
| State Transition | Create → Update → Delete                           |
| Regression       | Existing API behavior remains unchanged            |
| Error Handling   | Invalid booking ID, deleted booking ID             |

---

## GitHub Actions CI/CD

The workflow file is:

```text
.github/workflows/allure-report.yml
```

It runs on:

* Push to `main` or `master`
* Pull request to `main` or `master`
* Manual run via `workflow_dispatch`

CI steps:

```text
Checkout source
  ↓
Setup Node.js 20
  ↓
npm ci
  ↓
TypeScript check
  ↓
ESLint check
  ↓
Prettier format check
  ↓
Run API tests
  ↓
Generate Allure metadata
  ↓
Generate Allure HTML report
  ↓
Upload Allure artifact
  ↓
Upload Playwright artifact
  ↓
Deploy Allure Report to GitHub Pages
```

---

## GitHub Pages Allure Report

To publish Allure Report online, enable GitHub Pages:

```text
Repository → Settings → Pages → Build and deployment → Source → GitHub Actions
```

After the workflow runs successfully, the report will be available at:

```text
https://trungtinle301099-meo.github.io/Booking_management-/
```

---

## Commit and Push Workflow

Use this standard workflow when updating code:

```bash
git status

git add .

git commit -m "test: add/update booking api automation tests"

git push
```

If this is your first push:

```bash
git remote add origin https://github.com/trungtinle301099-meo/Booking_management-.git
git branch -M main
git push -u origin main
```

If remote already exists:

```bash
git remote -v
git push -u origin main
```

---

## Troubleshooting

### 1. `package.json not found`

You are not in the project root.

Fix:

```bash
pwd
ls -la
cd Booking_management-
```

---

### 2. `npm ci` fails because package-lock.json is missing

Use:

```bash
npm install
```

Then commit the generated lockfile:

```bash
git add package-lock.json package.json
git commit -m "chore: add package lock"
```

---

### 3. TypeScript config deprecated warning

Run:

```bash
npm run type-check
```

If it fails, check `tsconfig.json`.

Recommended important settings:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "noEmit": true
  }
}
```

---

### 4. ESLint package missing, for example `@eslint/js`

Install missing packages:

```bash
npm install --save-dev --save-exact eslint @eslint/js typescript-eslint
```

Then run:

```bash
npm run lint
```

Auto-fix when possible:

```bash
npm run lint -- --fix
```

---

### 5. Prettier format check fails

Run:

```bash
npm run format
npm run format:check
```

---

### 6. `test:report` script missing

Make sure `package.json` contains:

```json
{
  "scripts": {
    "test:report": "playwright show-report"
  }
}
```

---

### 7. Allure report has no data

Make sure your `playwright.config.ts` has Allure reporter:

```ts
reporter: [
  ['list'],
  ['html', { open: 'never', outputFolder: 'playwright-report' }],
  [
    'allure-playwright',
    {
      resultsDir: 'allure-results',
      detail: true,
      suiteTitle: true,
    },
  ],
],
```

Then run:

```bash
npm run test:api:allure
npm run allure:generate
npm run allure:open
```

---

### 8. `allure-results` does not exist

This means tests have not been run with Allure reporter yet.

Fix:

```bash
npm run test:api:allure
```

---

### 9. GitHub Pages does not show report

Check:

```text
Repository → Settings → Pages → Build and deployment → Source → GitHub Actions
```

Then rerun workflow:

```text
Repository → Actions → Allure Report - Booking Management API Automation → Run workflow
```

---

### 10. API test fails because public API is unstable

Restful Booker is a public demo API, so it may sometimes be slow or unstable.

Try:

```bash
npm run test:api
```

If still failing, check:

```bash
curl https://restful-booker.herokuapp.com/booking
```

---

## Development Best Practices

Follow these rules when writing new tests:

1. Do not hardcode full URLs in test files.
2. Put endpoint paths in `src/api/endpoints`.
3. Put request logic in `src/api/services`.
4. Put shared assertions in `src/api/assertions`.
5. Put reusable payloads in `src/data`.
6. Put TypeScript interfaces in `src/types`.
7. Put response validation schemas in `src/schemas`.
8. Use custom fixtures from `src/fixtures/api.fixture.ts`.
9. Add Allure metadata for every test case.
10. Attach request and response body to Allure report.
11. Do not commit `.env`, `allure-results`, `allure-report`, `playwright-report`, `test-results`.
12. Run `npm run check` before pushing code.

---

## Current Status

Current framework setup is stable after resolving:

| Issue                                       | Status |
| ------------------------------------------- | ------ |
| TypeScript config deprecated warning        | Fixed  |
| Missing `test:report` script                | Fixed  |
| Missing ESLint package such as `@eslint/js` | Fixed  |
| Import type ESLint rule issue               | Fixed  |
| Prettier format issues                      | Fixed  |
| Allure Report integration                   | Added  |
| Allure metadata and attachments             | Added  |

---

## Recommended Next Steps

Recommended next API tests to add:

1. `GET /booking` - Get all booking IDs
2. `GET /booking/:id` - Get booking detail
3. `POST /booking` - Create booking
4. `PUT /booking/:id` - Full update booking
5. `DELETE /booking/:id` - Delete booking
6. Negative tests for invalid ID
7. Negative tests for missing auth token
8. Schema validation tests
9. Boundary tests for invalid payload values
10. End-to-end API flow test:

```text
Create Booking → Get Booking → Update Booking → Partial Update Booking → Delete Booking
```

---

## License

This project is for learning and API automation practice purposes.

---

## Author

Maintainer: `trungtinle`

Repository:

```text
https://github.com/trungtinle301099-meo/Booking_management-.git
```
