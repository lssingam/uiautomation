const { test, expect } = require('@playwright/test');
const { createUsername, testData } = require('../support/test-data');

function exactText(text) {
  return new RegExp(`^${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`);
}

async function login(page) {
  await page.goto('/');
  await page.getByPlaceholder('Username').fill(testData.login.username);
  await page.getByPlaceholder('Password').fill(testData.login.password);
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

async function selectFirstEmployeeSuggestion(page, searchText) {
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

function userRowByUsername(page, username) {
  return page.locator('.oxd-table-card').filter({
    has: page.locator('.oxd-table-cell').filter({ hasText: exactText(username) })
  });
}

async function openUserForEdit(page, username) {
  await searchUser(page, username);

  const userRow = userRowByUsername(page, username);
  await expect(userRow).toBeVisible();
  await userRow.locator('button').last().click();
  await expect(page.getByRole('heading', { name: 'Edit User' })).toBeVisible();
}

async function placeholderStep(page) {
  // Placeholder for the next OrangeHRM workflow step.
}

test.describe.serial('OrangeHRM login and user creation', () => {
  let createdUsername;

  test('logs in with valid admin credentials', async ({ page }) => {
    await login(page);
  });

  test('creates a configured user', async ({ page }) => {
    const username = createUsername();
    createdUsername = username;

    await login(page);

    await page.getByRole('link', { name: 'Admin' }).click();
    await expect(page.getByRole('heading', { name: 'System Users' })).toBeVisible();

    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByRole('heading', { name: 'Add User' })).toBeVisible();

    await selectDropdownOption(page, 'User Role', testData.userCreation.role);
    await selectFirstEmployeeSuggestion(page, testData.userCreation.employeeSearch);
    await selectDropdownOption(page, 'Status', testData.userCreation.status);
    await formGroup(page, 'Username').locator('input').fill(username);
    await formGroup(page, 'Password').locator('input[type="password"]').fill(testData.userCreation.password);
    await formGroup(page, 'Confirm Password').locator('input[type="password"]').fill(testData.userCreation.password);

    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.locator('.oxd-toast')).toContainText('Successfully Saved');

    await searchUser(page, username);
    await expect(userRowByUsername(page, username)).toBeVisible();
  });

  test('updates an existing user employee name', async ({ page }) => {
    const username = testData.userUpdate.username || createdUsername;

    await login(page);
    await openUserForEdit(page, username);

    await selectFirstEmployeeSuggestion(page, testData.userUpdate.employeeSearch);
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.locator('.oxd-toast')).toContainText('Successfully Updated');

    await searchUser(page, username);
    await expect(userRowByUsername(page, username)).toBeVisible();
  });
});
