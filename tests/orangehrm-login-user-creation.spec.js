const { test, expect } = require('@playwright/test');

const credentials = {
  username: process.env.ORANGEHRM_USERNAME || 'Admin',
  password: process.env.ORANGEHRM_PASSWORD || 'admin123'
};

const newUserPassword = process.env.ORANGEHRM_NEW_USER_PASSWORD || 'User@12345';
const employeeSearchText = process.env.ORANGEHRM_EMPLOYEE_SEARCH || 'orange';

function exactText(text) {
  return new RegExp(`^${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`);
}

async function login(page) {
  await page.goto('/');
  await page.getByPlaceholder('Username').fill(credentials.username);
  await page.getByPlaceholder('Password').fill(credentials.password);
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/\/dashboard\/index/);
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
}

function formGroup(page, label) {
  return page.locator('.oxd-input-group').filter({
    has: page.locator('label').filter({ hasText: exactText(label) })
  });
}

async function selectDropdownOption(page, label, option) {
  await formGroup(page, label).locator('.oxd-select-text').click();
  await page.locator('.oxd-select-option', { hasText: option }).click();
}

async function selectFirstEmployeeSuggestion(page, searchText = employeeSearchText) {
  const employeeNameInput = formGroup(page, 'Employee Name').getByPlaceholder('Type for hints...');
  const suggestions = page.locator('.oxd-autocomplete-option');

  await employeeNameInput.fill(searchText);
  await suggestions.first().waitFor({ state: 'visible' });
  await expect(suggestions.first()).not.toHaveText(/Searching/i);
  await suggestions.first().click();
}

async function searchUser(page, username) {
  await page.getByRole('link', { name: 'Admin' }).click();
  await expect(page.getByRole('heading', { name: 'System Users' })).toBeVisible();

  await formGroup(page, 'Username').locator('input').fill(username);
  await page.getByRole('button', { name: 'Search' }).click();
}

test.describe('OrangeHRM login and user creation', () => {
  test('logs in with valid admin credentials', async ({ page }) => {
    await login(page);
  });

  test('creates a new enabled ESS user', async ({ page }) => {
    const username = `auto_user_${Date.now()}`;

    await login(page);

    await page.getByRole('link', { name: 'Admin' }).click();
    await expect(page.getByRole('heading', { name: 'System Users' })).toBeVisible();

    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByRole('heading', { name: 'Add User' })).toBeVisible();

    await selectDropdownOption(page, 'User Role', 'ESS');
    await selectFirstEmployeeSuggestion(page);
    await selectDropdownOption(page, 'Status', 'Enabled');
    await formGroup(page, 'Username').locator('input').fill(username);
    await formGroup(page, 'Password').locator('input[type="password"]').fill(newUserPassword);
    await formGroup(page, 'Confirm Password').locator('input[type="password"]').fill(newUserPassword);

    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.locator('.oxd-toast')).toContainText('Successfully Saved');

    await searchUser(page, username);
    await expect(page.locator('.oxd-table-card')).toContainText(username);
  });
});
