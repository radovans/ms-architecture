# Cypress Integration Guide

## 🎯 Overview

This guide provides a complete walkthrough of the Cypress integration for testing your Spring Boot microservices architecture. The setup includes comprehensive API testing capabilities with advanced features for load testing, error handling, and CI/CD integration.

## 📁 Project Structure

```
tests/
├── cypress/
│   ├── e2e/                           # Test specifications
│   │   ├── hello-service.cy.js        # Basic API tests
│   │   └── advanced-api-tests.cy.js   # Advanced scenarios
│   ├── fixtures/                      # Test data
│   │   └── hello-service.json         # Hello service test data
│   └── support/                       # Support files
│       ├── commands.js                # Custom Cypress commands
│       ├── e2e.js                     # Global configuration
│       └── utils.js                   # Utility functions
├── cypress.config.js                  # Main configuration
├── cypress.config.local.js            # Local development config
├── package.json                       # Dependencies and scripts
├── run-tests.sh                       # Test runner script
├── README.md                          # Main documentation
└── INTEGRATION_GUIDE.md               # This file
```

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 16+ and npm
- Java 21 and Maven
- Spring Boot application

### 2. Setup
```bash
# Navigate to tests directory
cd tests

# Install dependencies
npm install

# Start your Spring Boot application
cd ../backend/helloservice
./mvnw spring-boot:run

# In another terminal, run tests
cd ../../tests
npm test
```

### 3. Available Commands

#### Basic Testing
```bash
npm test                    # Run all tests
npm run test:open          # Open Cypress GUI
npm run test:headless      # Run in headless mode
npm run test:hello         # Run hello service tests only
```

#### Advanced Testing
```bash
npm run test:advanced      # Run advanced test scenarios
npm run test:local         # Use local configuration
npm run test:debug         # Run with debug mode
npm run test:parallel      # Run tests in parallel
```

#### Using the Test Runner Script
```bash
./run-tests.sh             # Run all tests
./run-tests.sh open        # Open GUI
./run-tests.sh hello       # Run hello tests
./run-tests.sh headless    # Run headless
```

## 🔧 Configuration

### Main Configuration (`cypress.config.js`)
- Base URL: `http://localhost:8080`
- API URL: `http://localhost:8080/api/v1`
- Timeouts: 10 seconds
- Videos: Disabled for faster runs

### Local Configuration (`cypress.config.local.js`)
- Extended timeouts for development
- Video recording enabled
- Environment-specific settings

## 🧪 Test Categories

### 1. Basic API Tests (`hello-service.cy.js`)
- **Endpoint Validation**: Tests `/api/v1/hello` endpoint
- **Response Structure**: Validates JSON response format
- **Performance**: Checks response times
- **Error Handling**: Tests 404 and 405 responses
- **Health Checks**: Validates actuator endpoints

### 2. Advanced API Tests (`advanced-api-tests.cy.js`)
- **Load Testing**: Multiple concurrent requests
- **Edge Cases**: Malformed requests, special characters
- **Schema Validation**: JSON response validation
- **Performance Metrics**: Response time analysis
- **Monitoring**: Health and metrics endpoints

## 🛠️ Custom Commands

### API Commands
```javascript
cy.apiGet('/hello')                    // GET request
cy.apiPost('/users', userData)         // POST request
cy.apiPut('/users/1', updateData)      // PUT request
cy.apiDelete('/users/1')               // DELETE request
cy.validateApiResponse(response, 200)  // Validate response
cy.waitForService(30000)               // Wait for service
```

### Utility Functions
```javascript
generateRandomString(8)                // Random string
generateRandomEmail()                  // Random email
validateJsonSchema(data, schema)       // Schema validation
logTestInfo('message', data)           // Logging
retryWithBackoff(fn, 3, 1000)         // Retry with backoff
```

## 📊 Test Data Management

### Fixtures
- **Location**: `cypress/fixtures/`
- **Purpose**: Store test data and expected responses
- **Usage**: `cy.fixture('hello-service')`

### Example Fixture
```json
{
  "validHelloResponse": {
    "message": "Hello, World!"
  },
  "testData": {
    "serviceName": "hello-service",
    "endpoint": "/api/v1/hello"
  }
}
```

## 🔄 CI/CD Integration

### GitHub Actions
The workflow automatically:
1. Sets up Node.js and Java environments
2. Installs dependencies
3. Builds Spring Boot application
4. Starts the application
5. Runs Cypress tests
6. Uploads artifacts (screenshots, videos, results)

### Local CI/CD
```bash
# Run tests with service startup
./run-tests.sh

# Run specific test suites
npm run test:smoke
npm run test:regression
```

## 📈 Performance Testing

### Load Testing Features
- Multiple concurrent requests
- Response time validation
- Performance metrics collection
- Stress testing scenarios

### Example Load Test
```javascript
it('should handle multiple rapid requests', () => {
  const requests = [];
  const numRequests = 10;
  
  for (let i = 0; i < numRequests; i++) {
    requests.push(cy.apiGet('/hello'));
  }
  
  cy.wrap(requests).then(() => {
    // All requests should complete successfully
  });
});
```

## 🐛 Debugging

### Debug Mode
```bash
npm run test:debug
```

### Common Issues
1. **Service Not Starting**: Check Spring Boot logs
2. **Connection Refused**: Verify port 8080 is available
3. **Test Timeouts**: Increase timeout in configuration
4. **Cypress Issues**: Clear cache with `npx cypress cache clear`

### Logging
- Custom logging with timestamps
- Performance metrics logging
- Test execution tracking

## 🔒 Security Testing

### Security Features
- Input validation testing
- Special character handling
- Malformed request testing
- Header validation

### Example Security Test
```javascript
it('should handle special characters in paths', () => {
  const specialChars = ['%20', '%2F', '%3F', '%23', '%25'];
  
  specialChars.forEach(char => {
    cy.apiGet(`/hello${char}test`)
      .then(response => {
        expect(response.status).to.eq(404);
      });
  });
});
```

## 📝 Best Practices

### Test Organization
1. Group related tests in describe blocks
2. Use descriptive test names
3. Follow AAA pattern (Arrange, Act, Assert)
4. Keep tests independent

### Data Management
1. Use fixtures for test data
2. Generate random data for unique tests
3. Clean up test data after tests
4. Validate response schemas

### Performance
1. Set appropriate timeouts
2. Monitor response times
3. Test under load
4. Use parallel execution when possible

### Maintenance
1. Update test data when APIs change
2. Review and update timeouts
3. Monitor test execution times
4. Keep dependencies updated

## 🚀 Next Steps

### Extending the Framework
1. Add more service endpoints
2. Implement authentication testing
3. Add database integration tests
4. Create visual regression tests

### Advanced Features
1. Custom reporters
2. Test data factories
3. API mocking
4. Performance benchmarking

### Integration
1. Add to existing CI/CD pipeline
2. Integrate with monitoring tools
3. Set up test result reporting
4. Configure alerting

## 📚 Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [Spring Boot Testing](https://spring.io/guides/gs/testing-web/)
- [API Testing Best Practices](https://www.cypress.io/blog/2020/02/12/working-with-apis-in-cypress/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## 🤝 Contributing

1. Follow existing test patterns
2. Add appropriate error handling
3. Include performance considerations
4. Update documentation
5. Add new test scenarios as needed

---

This integration provides a robust foundation for API testing in your microservices architecture. The framework is designed to be scalable, maintainable, and comprehensive, covering all aspects of API testing from basic functionality to advanced scenarios. 