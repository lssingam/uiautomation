# OrangeHRM Playwright Suite

This suite covers:

- Admin login
- Creation of a new enabled ESS user from the Admin page
- Verification that the new user appears in the System Users table
- Employee name update for an existing user

## Setup

```bash
npm install
npm run install:browsers
```

## Run Tests

```bash
npm test
```

Useful variants:

```bash
npm run test:chrome
npm run test:chrome:headed
npm run test:bundled-chromium
npm run test:bundled-chromium:headed
npm run test:headed
npm run test:ui
npm run report
```

`npm run test:chrome` uses the locally installed Google Chrome app. This is useful on macOS when the bundled Playwright Chromium headless shell is blocked by launch permissions.
Use `npm run test:chrome:headed` when you want to see the browser while the test runs.

## Test Data

Default test data lives in:

```text
test-data/orangehrm-test-data.json
```

Change that file when you want different default login, user creation, or user update data.

## Optional Environment Overrides

```bash
ORANGEHRM_BASE_URL="https://opensource-demo.orangehrmlive.com/web/index.php/auth/login" \
ORANGEHRM_USERNAME="Admin" \
ORANGEHRM_PASSWORD="admin123" \
ORANGEHRM_NEW_USER_ROLE="ESS" \
ORANGEHRM_EMPLOYEE_SEARCH="orange" \
ORANGEHRM_NEW_USER_STATUS="Enabled" \
ORANGEHRM_NEW_USERNAME_PREFIX="auto_user" \
ORANGEHRM_NEW_USER_PASSWORD="User@12345" \
ORANGEHRM_EXISTING_USERNAME="" \
ORANGEHRM_UPDATED_EMPLOYEE_SEARCH="James  Butler" \
npm test
```

Use `ORANGEHRM_NEW_USERNAME` if you need a fixed username instead of a timestamped username.
Leave `ORANGEHRM_EXISTING_USERNAME` blank when the update test should edit the user created earlier in the same run.
