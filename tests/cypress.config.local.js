const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.js',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true, // Enable video recording for local development
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 15000, // Longer timeout for local development
    requestTimeout: 15000,
    responseTimeout: 15000,
    env: {
      apiUrl: 'http://localhost:8080/api/v1',
      environment: 'local'
    }
  },
  component: {
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack',
    },
  },
}) 