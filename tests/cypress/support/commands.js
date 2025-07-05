// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command for API requests with better error handling
Cypress.Commands.add('apiRequest', (method, endpoint, body = null, options = {}) => {
  const defaultOptions = {
    method: method,
    url: `${Cypress.env('apiUrl')}${endpoint}`,
    failOnStatusCode: false,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  if (body) {
    defaultOptions.body = body;
  }

  const finalOptions = { ...defaultOptions, ...options };

  return cy.request(finalOptions);
});

// Custom command for GET requests
Cypress.Commands.add('apiGet', (endpoint, options = {}) => {
  return cy.apiRequest('GET', endpoint, null, options);
});

// Custom command for POST requests
Cypress.Commands.add('apiPost', (endpoint, body, options = {}) => {
  return cy.apiRequest('POST', endpoint, body, options);
});

// Custom command for PUT requests
Cypress.Commands.add('apiPut', (endpoint, body, options = {}) => {
  return cy.apiRequest('PUT', endpoint, body, options);
});

// Custom command for DELETE requests
Cypress.Commands.add('apiDelete', (endpoint, options = {}) => {
  return cy.apiRequest('DELETE', endpoint, null, options);
});

// Custom command to check API response structure
Cypress.Commands.add('validateApiResponse', (response, expectedStatus = 200) => {
  expect(response.status).to.eq(expectedStatus);
  expect(response.headers).to.have.property('content-type');
  expect(response.headers['content-type']).to.include('application/json');
});

// Custom command to wait for service to be ready
Cypress.Commands.add('waitForService', (timeout = 30000) => {
  cy.request({
    method: 'GET',
    url: 'http://localhost:8080/actuator/health',
    failOnStatusCode: false,
    timeout: timeout
  }).then((response) => {
    if (response.status !== 200) {
      cy.wait(2000);
      cy.waitForService(timeout - 2000);
    }
  });
}); 