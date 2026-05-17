const defaults = require('../test-data/orangehrm-test-data.json');

function env(name, fallback) {
  return process.env[name] || fallback;
}

const testData = {
  baseURL: env('ORANGEHRM_BASE_URL', defaults.baseURL),
  login: {
    username: env('ORANGEHRM_USERNAME', defaults.login.username),
    password: env('ORANGEHRM_PASSWORD', defaults.login.password)
  },
  userCreation: {
    role: env('ORANGEHRM_NEW_USER_ROLE', defaults.userCreation.role),
    employeeSearch: env('ORANGEHRM_EMPLOYEE_SEARCH', defaults.userCreation.employeeSearch),
    status: env('ORANGEHRM_NEW_USER_STATUS', defaults.userCreation.status),
    usernamePrefix: env('ORANGEHRM_NEW_USERNAME_PREFIX', defaults.userCreation.usernamePrefix),
    username: process.env.ORANGEHRM_NEW_USERNAME,
    password: env('ORANGEHRM_NEW_USER_PASSWORD', defaults.userCreation.password)
  },
  userUpdate: {
    username: env('ORANGEHRM_EXISTING_USERNAME', defaults.userUpdate.username),
    employeeSearch: env('ORANGEHRM_UPDATED_EMPLOYEE_SEARCH', defaults.userUpdate.employeeSearch)
  }
};

function createUsername() {
  return testData.userCreation.username || `${testData.userCreation.usernamePrefix}_${Date.now()}`;
}

module.exports = {
  createUsername,
  testData
};
