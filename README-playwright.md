# OrangeHRM Playwright Suite

This suite covers:

- Admin login with `Admin` / `admin123`
- Creation of a new enabled ESS user from the Admin page
- Verification that the new user appears in the System Users table

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

## Optional Environment Overrides

```bash
ORANGEHRM_BASE_URL="https://opensource-demo.orangehrmlive.com/web/index.php/auth/login" \
ORANGEHRM_USERNAME="Admin" \
ORANGEHRM_PASSWORD="admin123" \
ORANGEHRM_EMPLOYEE_SEARCH="Orange" \
ORANGEHRM_NEW_USER_PASSWORD="User@12345" \
npm test
```
