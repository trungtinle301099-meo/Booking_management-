# Booking Management API Automation — Restful Booker

# frd: https://docs.google.com/document/d/1akz58LQfaUj-D0SMcwCDe581yFAaIrft/edit

**Production-ready API automation framework** for [Restful Booker](https://restful-booker.herokuapp.com) REST API, built with **Playwright Test + TypeScript** following enterprise-grade best practices with clean architecture, comprehensive test coverage, and automated reporting.

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-trungtinle301099--meo-blue?logo=github)](https://github.com/trungtinle301099-meo/Booking_management-)
[![Allure Report](https://img.shields.io/badge/Allure-Report-green?logo=https://docs.qameta.io/allure/)](https://trungtinle301099-meo.github.io/Booking_management-/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0+-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.60+-blue?logo=playwright)](https://playwright.dev/)

</div>

---

## 📖 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Architecture Overview](#architecture-overview)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Allure Reporting](#allure-reporting)
- [CI/CD Pipeline](#cicd-pipeline)
- [Code Quality](#code-quality)
- [Test Development Guide](#test-development-guide)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Resources](#resources)

---

## Overview

This framework is designed for:

✅ **API Testing** - Complete REST API test coverage  
✅ **Type Safety** - Full TypeScript support with type validation  
✅ **Maintainability** - Service layer architecture for easy maintenance  
✅ **Scalability** - Organized structure supporting hundreds of tests  
✅ **Reporting** - Rich Allure reports with detailed test metrics  
✅ **CI/CD Integration** - Automated testing and reporting via GitHub Actions  
✅ **Best Practices** - Following industry standards and patterns  

The framework architecture separates concerns clearly:

```
Environment Config
    ↓
Test Data & Fixtures
    ↓
API Endpoints & Services
    ↓
Business Logic Assertions
    ↓
Test Specifications
    ↓
Allure Reports
```

---

## Tech Stack

| Component | Version | Purpose |
|-----------|---------|---------|
| **Runtime** | | |
| Node.js | 20+ | Runtime environment |
| npm | Latest | Package manager |
| **Testing** | | |
| Playwright Test | 1.60.0 | API test runner & assertions |
| TypeScript | 6.0.3 | Type-safe code |
| **Validation** | | |
| Zod | 4.4.3 | Runtime schema validation |
| **Quality & Linting** | | |
| ESLint | ^10.4.1 | Code linting |
| TypeScript ESLint | ^8.60.1 | TS-specific linting |
| Prettier | 3.8.3 | Code formatting |
| **Reporting** | | |
| Allure Playwright | 3.9.0 | Rich test reporting |
| Allure CLI | 2.42.0 | Report generation |
| **Configuration** | | |
| dotenv | 17.4.2 | Environment management |

---

## Prerequisites

### System Requirements

| Requirement | Version | Notes |
|---|---|---|
| Node.js | 20+ | Recommended for LTS stability |
| npm | 10+ | Bundled with Node.js |
| Git | Latest | For version control |
| VS Code | Latest | Optional, recommended IDE |

### Verify Installation

```bash
# Check Node.js
node -v
# Expected: v20.x.x or higher

# Check npm
npm -v
# Expected: 10.x.x or higher

# Check Git
git --version
# Expected: git version 2.x.x or higher
```

---

## Quick Start

### Step 1: Clone Repository

```bash
# Clone the repository
git clone https://github.com/trungtinle301099-meo/Booking_management-.git

# Navigate to project directory
cd Booking_management-

# Verify project structure
ls -la
```

### Step 2: Install Dependencies

```bash
# Install dependencies from lock file (recommended)
npm ci

# Or if package-lock.json is missing
npm install
```

### Step 3: Install Playwright Browsers

```bash
# Install Playwright browsers (for future UI tests)
npx playwright install --with-deps

# Or on macOS (simpler)
npx playwright install
```

### Step 4: Setup Environment Variables

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your settings
nano .env
```

**Example `.env` content:**

```env
# API Configuration
BASE_URL=https://restful-booker.herokuapp.com

# Restful Booker Credentials
BOOKING_USERNAME=admin
BOOKING_PASSWORD=password123
```

### Step 5: Verify Setup

```bash
# Run type checking
npm run type-check

# Run linter
npm run lint

# Run all API tests
npm run test:api
```

### Step 6: View Results

```bash
# Open Playwright HTML report
npm run test:report

# Or generate Allure report (requires Allure CLI)
npm run report:allure
```

---

## Project Structure

```
Booking_management-/
│
├── .github/
│   └── workflows/
│       └── ci.yml                    # GitHub Actions CI pipeline
│
├── src/
│   ├── api/
│   │   ├── assertions/
│   │   │   └── response.assertion.ts # Reusable API assertions
│   │   │
│   │   ├── clients/
│   │   │   └── api-client.ts         # HTTP client wrapper
│   │   │
│   │   ├── endpoints/
│   │   │   ├── auth.endpoint.ts      # Auth endpoint constants
│   │   │   └── booking.endpoint.ts   # Booking endpoint constants
│   │   │
│   │   └── services/
│   │       ├── auth.service.ts       # Auth service methods
│   │       └── booking.service.ts    # Booking service methods
│   │
│   ├── config/
│   │   └── env.config.ts             # Environment configuration
│   │
│   ├── data/
│   │   ├── auth.data.ts              # Auth test data
│   │   └── booking.data.ts           # Booking test data
│   │
│   ├── fixtures/
│   │   └── api.fixture.ts            # Custom Playwright fixtures
│   │
│   ├── helpers/
│   │   ├── random.helper.ts          # Random data generation
│   │   ├── token.helper.ts           # Token operations
│   │   ├── logger.helper.ts          # Logging utilities
│   │   ├── retry.helper.ts           # Retry logic
│   │   ├── polling.helper.ts         # Polling utilities
│   │   ├── allure.helper.ts          # Allure reporting
│   │   └── test-cleanup.helper.ts    # Test cleanup utilities
│   │
│   ├── schemas/
│   │   ├── auth.schema.ts            # Auth response schemas (Zod)
│   │   └── booking.schema.ts         # Booking response schemas (Zod)
│   │
│   └── types/
│       ├── auth.type.ts              # Auth TypeScript types
│       └── booking.type.ts           # Booking TypeScript types
│
├── tests/
│   └── api/
│       ├── auth/
│       │   └── login.api.spec.ts
│       │
│       ├── get_booking_id/
│       │   └── get-booking-id.api.spec.ts
│       │
│       ├── get_booking/
│       │   └── get-booking.api.spec.ts
│       │
│       ├── create_booking/
│       │   └── create-booking.api.spec.ts
│       │
│       ├── update_booking/
│       │   └── update-booking.api.spec.ts
│       │
│       ├── booking/
│       │   └── update-partial-booking.api.spec.ts
│       │
│       └── delete_booking/
│           └── delete-booking.api.spec.ts
│
├── allure-results/                   # Allure test results (generated)
├── allure-report/                    # Allure HTML report (generated)
├── playwright-report/                # Playwright HTML report (generated)
├── test-results/                     # Test results (generated)
│
├── .env                              # Local env vars (gitignored)
├── .env.example                      # Env template
├── .gitignore                        # Git ignore rules
├── .prettierrc                       # Prettier config
├── .prettierignore                   # Prettier ignore rules
├── eslint.config.mjs                 # ESLint config (flat)
├── package.json                      # Dependencies & scripts
├── package-lock.json                 # Dependency lock file
├── playwright.config.ts              # Playwright config
├── tsconfig.json                     # TypeScript config
└── README.md                         # This file
```

---

## Architecture Overview

### 1. **Endpoint Layer** (`src/api/endpoints/`)

Defines API endpoint constants and routes.

```typescript
// Example: auth.endpoint.ts
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth',
} as const;

// Example: booking.endpoint.ts
export const BOOKING_ENDPOINTS = {
  LIST: '/booking',
  DETAIL: (id: number) => `/booking/${id}`,
  CREATE: '/booking',
  UPDATE: (id: number) => `/booking/${id}`,
  DELETE: (id: number) => `/booking/${id}`,
} as const;
```

**Benefits:**
- Centralized route management
- Easy to update when API changes
- Prevents hardcoded URLs in tests

### 2. **API Client Layer** (`src/api/clients/`)

Wraps HTTP client with authentication, error handling, and logging.

```typescript
// Example usage
const client = new APIClient(baseUrl);
const response = await client.get(endpoint, { headers });
const response = await client.post(endpoint, body, { headers });
const response = await client.patch(endpoint, body, { headers });
const response = await client.delete(endpoint, { headers });
```

**Responsibilities:**
- HTTP request/response handling
- Authentication token injection
- Error handling & retries
- Request/response logging

### 3. **Service Layer** (`src/api/services/`)

Business logic for API operations with methods grouped by domain.

```typescript
// Example: booking.service.ts
export class BookingService {
  constructor(private client: APIClient) {}

  async createBooking(data: Booking): Promise<Response> {
    return this.client.post(BOOKING_ENDPOINTS.CREATE, data);
  }

  async getBooking(id: number): Promise<Response> {
    return this.client.get(BOOKING_ENDPOINTS.DETAIL(id));
  }

  async updateBooking(id: number, data: Booking, token: string): Promise<Response> {
    return this.client.put(
      BOOKING_ENDPOINTS.UPDATE(id),
      data,
      { headers: { Cookie: `token=${token}` } }
    );
  }

  async partialUpdateBooking(id: number, data: Partial<Booking>, token: string): Promise<Response> {
    return this.client.patch(
      BOOKING_ENDPOINTS.UPDATE(id),
      data,
      { headers: { Cookie: `token=${token}` } }
    );
  }

  async deleteBooking(id: number, token: string): Promise<Response> {
    return this.client.delete(
      BOOKING_ENDPOINTS.DELETE(id),
      { headers: { Cookie: `token=${token}` } }
    );
  }
}
```

**Benefits:**
- Encapsulation of API logic
- Reusable methods across tests
- Easy to mock for unit testing
- Single responsibility principle

### 4. **Fixture Layer** (`src/fixtures/`)

Custom Playwright fixtures providing test utilities and services.

```typescript
// Example: api.fixture.ts
export const test = base.extend<APIFixture>({
  bookingService: async ({ request }, use) => {
    const client = new APIClient(process.env.BASE_URL!);
    const service = new BookingService(client);
    await use(service);
  },

  authService: async ({ request }, use) => {
    const client = new APIClient(process.env.BASE_URL!);
    const service = new AuthService(client);
    await use(service);
  },
});
```

**Usage in tests:**
```typescript
test('should create booking', async ({ bookingService, authService }) => {
  const response = await bookingService.createBooking(data);
  expect(response.status()).toBe(200);
});
```

**Benefits:**
- Automatic service initialization
- Consistent test setup/teardown
- Dependency injection pattern
- Reduced boilerplate

### 5. **Data Layer** (`src/data/`)

Test data with random generation for test isolation.

```typescript
// Example: booking.data.ts
import { randomString, randomPrice, randomBookingDates } from '../helpers/random.helper';

const { checkin, checkout } = randomBookingDates();

export const createBookingData: Booking = {
  firstname: randomString('FirstName'),
  lastname: randomString('LastName'),
  totalprice: randomPrice(50, 500),
  depositpaid: true,
  bookingdates: { checkin, checkout },
  additionalneeds: randomAdditionalNeeds(),
};
```

**Benefits:**
- Reusable test data
- Random data prevents test interdependencies
- Ensures tests pass consistently
- Easier data maintenance

### 6. **Schema Layer** (`src/schemas/`)

Zod schema validation for API responses.

```typescript
// Example: booking.schema.ts
import { z } from 'zod';

const bookingDatesSchema = z.object({
  checkin: z.string(),
  checkout: z.string(),
});

const bookingSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  totalprice: z.number(),
  depositpaid: z.boolean(),
  bookingdates: bookingDatesSchema,
  additionalneeds: z.string(),
});

export const createBookingResponseSchema = z.object({
  bookingid: z.number(),
  booking: bookingSchema,
});
```

**Usage in tests:**
```typescript
const response = await bookingService.createBooking(data);
const body = await response.json();
const validated = createBookingResponseSchema.parse(body); // Throws if invalid
```

**Benefits:**
- Runtime response validation
- Type safety for API responses
- Early error detection
- Clear error messages

### 7. **Test Layer** (`tests/api/`)

Organized test specifications following AAA pattern (Arrange, Act, Assert).

```typescript
test('CREATE_BOOKING_001 - should create booking successfully', async ({
  bookingService,
  authService,
}) => {
  // Arrange: Setup test data and preconditions
  const testData = createBookingData;
  const token = await generateAuthToken(authService);

  // Act: Execute the action being tested
  const response = await bookingService.createBooking(testData);
  const body = (await response.json()) as CreateBookingResponse;

  // Assert: Verify the results
  expect(response.status()).toBe(200);
  expect(body.bookingid).toBeGreaterThan(0);
  expect(body.booking.firstname).toBe(testData.firstname);
});
```

**Best Practices:**
- One responsibility per test
- Clear test naming (ACTION_WHAT_EXPECTED)
- Arrange-Act-Assert pattern
- Independent test execution
- Proper cleanup (beforeEach/afterEach)

---

## Configuration

### Environment Variables (`.env`)

```bash
cp .env.example .env
```

**Configuration options:**

```env
# API Configuration
BASE_URL=https://restful-booker.herokuapp.com

# Authentication
BOOKING_USERNAME=admin
BOOKING_PASSWORD=password123

# (Optional) Proxy configuration
# HTTP_PROXY=http://proxy.company.com:8080
# HTTPS_PROXY=https://proxy.company.com:8080

# (Optional) Timeouts
# API_TIMEOUT=30000
```

### Playwright Configuration (`playwright.config.ts`)

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['allure-playwright'],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://restful-booker.herokuapp.com',
    trace: 'on-first-retry',
  },
});
```

### TypeScript Configuration (`tsconfig.json`)

- Strict type checking enabled
- Path aliases for clean imports (`@`, `@api`, `@helpers`, etc.)
- CommonJS + ESNext module support
- ES2022 target

---

## Running Tests

### Run All Tests

```bash
# Run all tests (API only)
npm run test:api

# Run tests with UI (watch mode)
npm run test -- --ui

# Run tests in debug mode
npm run test -- --debug
```

### Run Specific Test Suite

```bash
# Run Auth tests only
npm run test:auth

# Run Booking tests only
npm run test:booking

# Run specific test file
npm run test:api -- tests/api/create_booking/create-booking.api.spec.ts

# Run tests matching pattern
npm run test:api -- -g "CREATE_BOOKING"
```

### Run with Options

```bash
# Run with specific number of workers
npm run test:api -- --workers=4

# Run with custom timeout (30 seconds)
npm run test:api -- --timeout=30000

# Run with retries
npm run test:api -- --retries=3

# Run in headed mode (shows browser activity for debugging)
npm run test:api -- --headed

# Dry run (don't actually run tests)
npm run test:api -- --list
```

### Test Filtering

```bash
# Run tests by file
npm run test:api -- tests/api/booking/create-booking.api.spec.ts

# Run tests matching regex
npm run test:api -- -g "should create"

# Run tests by tag (@smoke, @regression, etc.)
npm run test:api -- --grep "@smoke"

# Run tests excluding pattern
npm run test:api -- -g "should not"
```

---

## Allure Reporting

### What is Allure?

Allure is an open-source reporting framework providing rich, interactive test reports with:

✅ Test history and trends  
✅ Detailed test steps and attachments  
✅ Failure analysis and screenshots  
✅ Test metrics and statistics  
✅ Integration with CI/CD pipelines  

### Generate Allure Report

```bash
# Clean results and run tests, then generate report
npm run report:allure

# Or step-by-step:

# 1. Clean previous results
npm run allure:clean

# 2. Run tests (generates allure-results/)
npm run test:api

# 3. Generate HTML report
npm run allure:generate

# 4. Open report in browser
npm run allure:open

# Or serve from localhost:4040
npm run allure:serve
```

### Allure Report Structure

```
allure-report/
├── index.html                    # Main report page
├── widgets/
│   ├── summary.json              # Test summary
│   ├── categories-trend.json      # Category trends
│   └── duration-trend.json        # Duration trends
├── data/
│   ├── test-cases/
│   │   └── {test-id}.json        # Individual test details
│   ├── behaviors.json            # Behavior mapping
│   ├── categories.json           # Category grouping
│   └── timeline.json             # Execution timeline
└── ...
```

### Viewing Reports

**Option 1: Local Allure Report**
```bash
npm run allure:open
# Opens: file:///path/to/allure-report/index.html
```

**Option 2: GitHub Pages Hosting**
```
https://trungtinle301099-meo.github.io/Booking_management-/
```

The GitHub Actions workflow automatically publishes reports to GitHub Pages on each CI run.

### Allure Annotations in Tests

```typescript
import { feature, story, severity, description } from 'allure-js-commons';

test('CREATE_BOOKING_001 - create booking', async ({ bookingService }) => {
  await feature('Booking Management');
  await story('Create Booking');
  await severity('critical');
  await description('Verify that user can create a booking with valid data');

  // Test code...
  
  await test.info().attach('request-body.json', {
    body: JSON.stringify(requestData, null, 2),
    contentType: 'application/json',
  });
});
```

### Example Allure Report Features

- **Test Summary**: Total, passed, failed, skipped counts
- **Test Timeline**: Execution duration and order
- **Test Details**: Steps, attachments, parameters
- **Failure Analysis**: Error messages and stack traces
- **Test History**: Trends over multiple runs
- **Categories**: Group tests by type, feature, or severity

---

## CI/CD Pipeline

### GitHub Actions Workflow

The project includes automated CI/CD via GitHub Actions (`.github/workflows/ci.yml`).

**Workflow Triggers:**
- On `push` to main branch
- On `pull_request`
- Manual trigger (`workflow_dispatch`)

**Workflow Steps:**

1. **Setup** - Install dependencies
2. **Type Check** - TypeScript compilation
3. **Lint** - ESLint code analysis
4. **Test** - Run all API tests
5. **Generate Report** - Create Allure report
6. **Publish Report** - Deploy to GitHub Pages
7. **Upload Artifacts** - Store test results

### GitHub Actions Features

```yaml
# Automatic test matrix
strategy:
  matrix:
    node-version: [20.x]

# Automatic retry on failure
retry: 2

# Parallel test execution
workers: 4

# Artifact retention
retention-days: 30
```

### Viewing CI/CD Results

1. Go to GitHub repository
2. Click "Actions" tab
3. Select workflow run
4. View job logs and artifacts
5. View published Allure report at: https://trungtinle301099-meo.github.io/Booking_management-/

---

## Code Quality

### Type Checking

```bash
# Run TypeScript type check
npm run type-check

# Watch mode for development
npm run type-check -- --watch
```

**Features:**
- Strict null checking
- NoUnusedLocals disabled (for flexibility)
- Path aliases for clean imports
- JSDoc support

### Linting

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

**Rules:**
- TypeScript ESLint rules
- Playwright best practices
- Code consistency

### Code Formatting

```bash
# Check formatting
npm run format:check

# Auto-format code
npm run format
```

**Prettier Config:**
- 80-char line width
- 2-space indentation
- Single quotes
- Trailing commas

### Security Audit

```bash
# Audit dependencies for vulnerabilities
npm run security:audit

# Fix vulnerabilities
npm audit fix
```

### Complete Code Check

```bash
# Run all checks (type, lint, format, tests)
npm run check
```

---

## Test Development Guide

### Writing Your First Test

**1. Create test file** (`tests/api/booking/my-test.api.spec.ts`):

```typescript
import { test, expect } from '../../../src/fixtures/api.fixture';
import { expectStatus } from '../../../src/api/assertions/response.assertion';
import { logger } from '../../../src/helpers/logger.helper';

test.describe('[Booking API] My Feature', () => {
  let testDataId: number | undefined;

  test.beforeEach(async ({ bookingService }) => {
    // Setup: Create test data
    const response = await bookingService.createBooking(testData);
    const body = await response.json();
    testDataId = body.bookingid;
    logger.info(`Created booking: ${testDataId}`);
  });

  test.afterEach(async ({ bookingService }) => {
    // Cleanup: Delete test data
    if (testDataId) {
      await bookingService.deleteBooking(testDataId, token);
      logger.info(`Deleted booking: ${testDataId}`);
    }
  });

  test('MY_TEST_001 - should do something', async ({ bookingService }) => {
    // Arrange
    const testData = { /* ... */ };

    // Act
    const response = await bookingService.someMethod(testData);

    // Assert
    await expectStatus(response, 200);
    const body = await response.json();
    expect(body.id).toBeDefined();

    logger.pass('MY_TEST_001 - Test passed');
  });
});
```

**2. Run your test:**

```bash
npm run test:api -- -g "MY_TEST_001"
```

**3. View results:**

```bash
npm run test:report
```

### Test Naming Convention

```
{ACTION}_{RESOURCE}_{CASE_NUMBER} - {SHORT_DESCRIPTION}

Examples:
- CREATE_BOOKING_001 - should create booking with valid data
- UPDATE_BOOKING_002 - should update firstname only
- DELETE_BOOKING_001 - should delete booking successfully
- GET_BOOKING_001 - should retrieve booking by ID
- PATCH_BOOKING_FIRSTNAME_001 - should update firstname field only
```

### AAA Pattern

Every test should follow Arrange-Act-Assert:

```typescript
test('should do something', async ({ service }) => {
  // ✅ ARRANGE: Setup preconditions and test data
  const testData = { name: 'John', age: 30 };
  const preconditionId = await setupPrecondition();

  // ✅ ACT: Execute the action being tested
  const response = await service.doSomething(testData);
  const result = await response.json();

  // ✅ ASSERT: Verify the results
  expect(response.status()).toBe(200);
  expect(result.id).toBe(preconditionId);
  expect(result.name).toBe('John');
});
```

### Best Practices

✅ **DO:**
- One logical assertion per test
- Clear, descriptive test names
- Use test fixtures for setup/teardown
- Validate response status and structure
- Use random data to prevent interdependencies
- Document complex test logic with comments
- Include before/after hooks for cleanup

❌ **DON'T:**
- Hardcode values or IDs
- Depend on test execution order
- Share state between tests
- Test multiple unrelated things in one test
- Ignore cleanup (memory/resource leaks)
- Use sleep/wait unless necessary
- Mock API responses (test real API)

### Using Helpers

**Random Data:**
```typescript
import { randomString, randomPrice, randomAdditionalNeeds } from '@helpers/random.helper';

const firstName = randomString('FirstName');
const price = randomPrice(100, 500);
const needs = randomAdditionalNeeds();
```

**Token Generation:**
```typescript
import { generateAuthToken } from '@helpers/token.helper';

const token = await generateAuthToken(authService);
```

**Logging:**
```typescript
import { logger } from '@helpers/logger.helper';

logger.info('Test started');
logger.step('Creating booking');
logger.pass('Test passed');
```

**Retry Logic:**
```typescript
import { retryAction } from '@helpers/retry.helper';

const response = await retryAction(
  () => bookingService.createBooking(data),
  {
    retries: 2,
    delayMs: 500,
    retryName: 'Create booking',
  }
);
```

---

## Troubleshooting

### Common Issues

#### Issue: `npm ci` fails with "ERESOLVE"

**Solution:**
```bash
# Use npm install instead
npm install

# Or force legacy peer deps
npm ci --legacy-peer-deps
```

#### Issue: Tests timeout

**Solution:**
```bash
# Increase timeout
npm run test:api -- --timeout=60000

# Or in test code
test.setTimeout(60000);
```

#### Issue: Playwright browsers not found

**Solution:**
```bash
# Reinstall browsers
npx playwright install --with-deps

# Or with specific browsers
npx playwright install chromium firefox webkit
```

#### Issue: API returns 401 Unauthorized

**Solution:**
```typescript
// Verify token is being set
console.log('Token:', token);

// Check token expiration
const response = await bookingService.someMethod(data, token);

// Generate new token if needed
const newToken = await generateAuthToken(authService);
```

#### Issue: Tests pass locally but fail in CI

**Solution:**
```bash
# Test with CI environment variables
CI=true npm run test:api

# Run with retries like CI
npm run test:api -- --retries=2

# Run sequentially like CI
npm run test:api -- --workers=1
```

#### Issue: Allure report not generating

**Solution:**
```bash
# Verify Allure CLI is installed
npx allure --version

# Clean and regenerate
npm run allure:clean
npm run test:api
npm run allure:generate
npm run allure:open
```

### Debug Mode

```bash
# Run in debug mode with inspector
npm run test:api -- --debug

# Run with verbose output
npm run test:api -- --verbose

# Run specific test with full output
npm run test:api -- -g "TEST_NAME" --reporter=list
```

### Viewing Logs

**Playwright HTML Report:**
```bash
npm run test:report
# Open: playwright-report/index.html
```

**Allure Report:**
```bash
npm run allure:serve
# Open: http://localhost:4040
```

**Console Output:**
```bash
npm run test:api -- --reporter=list
```

---

## Contributing

### Development Workflow

1. **Create feature branch:**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Write tests:**
   ```bash
   # Add test files
   nano tests/api/my-feature/my-test.api.spec.ts
   ```

3. **Run local checks:**
   ```bash
   npm run check
   ```

4. **Commit changes:**
   ```bash
   git add .
   git commit -m "feat: add my feature tests"
   ```

5. **Push and create PR:**
   ```bash
   git push origin feature/my-feature
   ```

6. **Wait for CI to pass, then merge**

### Code Standards

- Follow existing patterns and naming conventions
- Write descriptive test names
- Include proper test data and assertions
- Add comments for complex logic
- Keep tests independent and isolated
- Clean up test data in afterEach hooks

### Adding New API Endpoints

1. **Define endpoint** in `src/api/endpoints/`:
   ```typescript
   export const NEW_ENDPOINTS = {
     ACTION: '/new/endpoint',
   } as const;
   ```

2. **Add service method** in `src/api/services/`:
   ```typescript
   async newMethod(data: Type): Promise<Response> {
     return this.client.post(NEW_ENDPOINTS.ACTION, data);
   }
   ```

3. **Add schema** in `src/schemas/`:
   ```typescript
   export const newResponseSchema = z.object({ /* ... */ });
   ```

4. **Write tests** in `tests/api/new-feature/`:
   ```typescript
   test('NEW_TEST_001 - should test new feature', async ({ service }) => {
     // Test code
   });
   ```

---

## Resources

### Official Documentation

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Test API](https://playwright.dev/docs/api/class-test)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zod Documentation](https://zod.dev/)
- [Allure Reports](https://docs.qameta.io/allure/)
- [ESLint Documentation](https://eslint.org/docs/rules/)

### REST API Endpoint

- [Restful Booker API](https://restful-booker.herokuapp.com/)
- [API Documentation](https://restful-booker.herokuapp.com/apidoc/index.html)

### Best Practices

- [REST API Testing Best Practices](https://assertible.com/blog/rest-api-testing-best-practices)
- [API Automation Testing Strategy](https://www.softwaretestingmaterial.com/api-testing/)
- [Test Automation Patterns](https://www.testautomationpatterns.org/)

### Example Repositories

- [Playwright Example Tests](https://github.com/microsoft/playwright/tree/main/examples)
- [API Automation Examples](https://github.com/topics/api-automation)

---

## Author

**Trung Tin Le**
- GitHub: [@trungtinle301099-meo](https://github.com/trungtinle301099-meo)
- Email: trungtinle301099@gmail.com

---

## License

MIT License - See LICENSE file for details

---

## Support

- 🐛 Found a bug? [Open an issue](https://github.com/trungtinle301099-meo/Booking_management-/issues)
- 💡 Have a suggestion? [Create a discussion](https://github.com/trungtinle301099-meo/Booking_management-/discussions)
- 📖 Need help? Check [existing issues](https://github.com/trungtinle301099-meo/Booking_management-/issues?q=is%3Aissue)

---

**Last Updated:** June 2026  
**Framework Version:** 1.0.0  
**Status:** Production-Ready ✅
