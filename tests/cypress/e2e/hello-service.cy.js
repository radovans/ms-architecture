describe('Hello Service API Tests', () => {
  beforeEach(() => {
    // Wait for the service to be ready before running tests
    cy.waitForService();
  });

  describe('GET /api/v1/hello', () => {
    it('should return hello message with 200 status', () => {
      cy.apiGet('/hello')
        .then((response) => {
          cy.validateApiResponse(response, 200);
          expect(response.body).to.have.property('message');
          expect(response.body.message).to.eq('Hello, World!');
        });
    });

    it('should return correct content type', () => {
      cy.apiGet('/hello')
        .then((response) => {
          expect(response.headers['content-type']).to.include('application/json');
        });
    });

    it('should have expected response structure', () => {
      cy.fixture('hello-service').then((fixture) => {
        cy.apiGet('/hello')
          .then((response) => {
            expect(response.body).to.deep.equal(fixture.validHelloResponse);
          });
      });
    });

    it('should respond within acceptable time', () => {
      const startTime = Date.now();
      cy.apiGet('/hello')
        .then((response) => {
          const responseTime = Date.now() - startTime;
          expect(responseTime).to.be.lessThan(1000); // Should respond within 1 second
          expect(response.status).to.eq(200);
        });
    });
  });

  describe('Health Check Endpoint', () => {
    it('should return health status', () => {
      cy.request({
        method: 'GET',
        url: 'http://localhost:8080/actuator/health',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('status');
        expect(response.body.status).to.eq('UP');
      });
    });

    it('should return detailed health information', () => {
      cy.request({
        method: 'GET',
        url: 'http://localhost:8080/actuator/health',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.body).to.have.property('components');
        expect(response.body.components).to.have.property('diskSpace');
        expect(response.body.components).to.have.property('ping');
      });
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent endpoint', () => {
      cy.apiGet('/non-existent-endpoint')
        .then((response) => {
          expect(response.status).to.eq(404);
        });
    });

    it('should handle invalid HTTP methods', () => {
      cy.apiPost('/hello', {})
        .then((response) => {
          expect(response.status).to.eq(405); // Method Not Allowed
        });
    });
  });

  describe('Performance Tests', () => {
    it('should handle multiple concurrent requests', () => {
      const requests = [];
      for (let i = 0; i < 5; i++) {
        requests.push(cy.apiGet('/hello'));
      }
      
      cy.wrap(requests).then(() => {
        // All requests should complete successfully
        requests.forEach(request => {
          request.then(response => {
            expect(response.status).to.eq(200);
          });
        });
      });
    });
  });
}); 