# Cypress API Testing

This directory contains Cypress tests for the Spring Boot microservices architecture.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Spring Boot application running on `http://localhost:8080`

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start your Spring Boot application:
```bash
cd ../backend/helloservice
./mvnw spring-boot:run
```

3. Run Cypress tests:
```bash
# Run all tests in headless mode
npm test

# Open Cypress Test Runner (GUI)
npm run test:open

# Run specific test file
npm run test:hello

# Run tests with video recording
npm run test:record
```

## Test Structure

```
tests/
├── cypress/
│   ├── e2e/                    # Test specifications
│   │   └── hello-service.cy.js # Hello service API tests
│   ├── fixtures/               # Test data
│   │   └── hello-service.json  # Hello service test data
│   └── support/                # Support files
│       ├── commands.js         # Custom Cypress commands
│       └── e2e.js             # Global configuration
├── cypress.config.js           # Cypress configuration
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## Available Commands

### Custom API Commands
- `cy.apiGet(endpoint)` - GET request
- `cy.apiPost(endpoint, body)` - POST request
- `cy.apiPut(endpoint, body)` - PUT request
- `cy.apiDelete(endpoint)` - DELETE request
- `cy.validateApiResponse(response, status)` - Validate API response
- `cy.waitForService(timeout)` - Wait for service to be ready

### NPM Scripts
- `npm test` - Run all tests in headless mode
- `npm run test:open` - Open Cypress Test Runner
- `npm run test:headless` - Run tests in headless mode
- `npm run test:api` - Run all API tests
- `npm run test:hello` - Run hello service tests only

## Test Categories

### 1. Hello Service Tests (`hello-service.cy.js`)
- **Basic Functionality**: Tests the `/api/v1/hello` endpoint
- **Response Validation**: Verifies response structure and content
- **Performance**: Checks response times
- **Error Handling**: Tests 404 and 405 responses
- **Health Checks**: Validates actuator health endpoint

### 2. Health Check Tests
- Service health status
- Detailed health information
- Component status (disk space, ping)

### 3. Error Handling Tests
- Non-existent endpoints (404)
- Invalid HTTP methods (405)
- Malformed requests

### 4. Performance Tests
- Response time validation
- Concurrent request handling

## Configuration

The Cypress configuration is in `cypress.config.js`:

- **Base URL**: `http://localhost:8080`
- **API URL**: `http://localhost:8080/api/v1`
- **Timeouts**: 10 seconds for requests
- **Viewport**: 1280x720
- **Videos**: Disabled for faster runs

## Best Practices

1. **Service Readiness**: Tests wait for the service to be ready using health checks
2. **Custom Commands**: Reusable API commands for consistent testing
3. **Fixtures**: Test data stored in JSON files for maintainability
4. **Error Handling**: Comprehensive error scenario testing
5. **Performance**: Response time validation included

## Adding New Tests

1. Create a new test file in `cypress/e2e/`
2. Add test data to `cypress/fixtures/` if needed
3. Use custom commands for API requests
4. Follow the existing test structure and naming conventions

## Troubleshooting

### Service Not Starting
- Ensure Spring Boot application is running on port 8080
- Check application logs for errors
- Verify actuator endpoints are enabled

### Test Failures
- Check if service is responding on health endpoint
- Verify network connectivity to localhost:8080
- Review test logs for specific error messages

### Cypress Issues
- Clear Cypress cache: `npx cypress cache clear`
- Update Cypress: `npm update cypress`
- Check Node.js version compatibility

## Integration with CI/CD

Add to your CI/CD pipeline:

```yaml
# Example GitHub Actions step
- name: Run Cypress Tests
  run: |
    cd tests
    npm install
    npm test
```

## Contributing

1. Follow existing test patterns
2. Add appropriate error handling
3. Include performance considerations
4. Update documentation for new features 