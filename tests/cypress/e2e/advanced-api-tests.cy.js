import { generateRandomString, logTestInfo, validateJsonSchema } from '../support/utils';

describe('Advanced API Testing Scenarios', () => {
  beforeEach(() => {
    cy.waitForService();
    logTestInfo('Starting advanced API test suite');
  });

  describe('Load Testing Simulation', () => {
    it('should handle multiple rapid requests', () => {
      const requests = [];
      const numRequests = 10;
      
      logTestInfo(`Sending ${numRequests} rapid requests`);
      
      // Send multiple requests rapidly
      for (let i = 0; i < numRequests; i++) {
        requests.push(
          cy.apiGet('/hello').then(response => {
            expect(response.status).to.eq(200);
            expect(response.body.message).to.eq('Hello, World!');
          })
        );
      }
      
      // Wait for all requests to complete
      cy.wrap(requests).then(() => {
        logTestInfo('All rapid requests completed successfully');
      });
    });

    it('should maintain consistent response times under load', () => {
      const responseTimes = [];
      const numRequests = 5;
      
      for (let i = 0; i < numRequests; i++) {
        const startTime = Date.now();
        cy.apiGet('/hello').then(response => {
          const responseTime = Date.now() - startTime;
          responseTimes.push(responseTime);
          expect(response.status).to.eq(200);
        });
      }
      
      cy.wrap(responseTimes).then(times => {
        const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
        logTestInfo(`Average response time: ${avgTime}ms`);
        expect(avgTime).to.be.lessThan(2000); // Should average under 2 seconds
      });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle malformed requests gracefully', () => {
      // Test with invalid content type
      cy.request({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/hello`,
        headers: {
          'Content-Type': 'text/plain',
          'Accept': 'text/plain'
        },
        failOnStatusCode: false
      }).then(response => {
        // Should still return JSON even with wrong Accept header
        expect(response.headers['content-type']).to.include('application/json');
        expect(response.status).to.eq(200);
      });
    });

    it('should handle very long request paths', () => {
      const longPath = '/hello/' + 'a'.repeat(1000);
      cy.apiGet(longPath)
        .then(response => {
          expect(response.status).to.eq(404);
        });
    });

    it('should handle special characters in paths', () => {
      const specialChars = ['%20', '%2F', '%3F', '%23', '%25'];
      
      specialChars.forEach(char => {
        cy.apiGet(`/hello${char}test`)
          .then(response => {
            expect(response.status).to.eq(404);
          });
      });
    });
  });

  describe('Response Validation', () => {
    it('should validate response schema', () => {
      const expectedSchema = {
        message: 'string'
      };
      
      cy.apiGet('/hello')
        .then(response => {
          expect(response.status).to.eq(200);
          validateJsonSchema(response.body, expectedSchema);
        });
    });

    it('should validate response headers', () => {
      cy.apiGet('/hello')
        .then(response => {
          // Check required headers
          expect(response.headers).to.have.property('content-type');
          expect(response.headers['content-type']).to.include('application/json');
          expect(response.headers).to.have.property('content-length');
          
          // Check that content length is reasonable
          const contentLength = parseInt(response.headers['content-length']);
          expect(contentLength).to.be.greaterThan(0);
          expect(contentLength).to.be.lessThan(1000); // Should be small for hello endpoint
        });
    });

    it('should validate response timing', () => {
      const startTime = Date.now();
      
      cy.apiGet('/hello')
        .then(response => {
          const responseTime = Date.now() - startTime;
          
          logTestInfo(`Response time: ${responseTime}ms`);
          
          expect(response.status).to.eq(200);
          expect(responseTime).to.be.lessThan(5000); // Should respond within 5 seconds
          
          // Log performance metrics
          cy.log(`Performance: ${responseTime}ms response time`);
        });
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle concurrent requests from different sources', () => {
      const promises = [];
      
      // Simulate requests from different sources
      for (let i = 0; i < 3; i++) {
        promises.push(
          new Promise((resolve) => {
            cy.apiGet('/hello').then(response => {
              resolve(response);
            });
          })
        );
      }
      
      cy.wrap(Promise.all(promises)).then(responses => {
        responses.forEach(response => {
          expect(response.status).to.eq(200);
          expect(response.body.message).to.eq('Hello, World!');
        });
        
        logTestInfo('All concurrent requests completed successfully');
      });
    });
  });

  describe('Health and Monitoring', () => {
    it('should provide detailed health information', () => {
      cy.request({
        method: 'GET',
        url: 'http://localhost:8080/actuator/health',
        failOnStatusCode: false
      }).then(response => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('status');
        expect(response.body.status).to.eq('UP');
        
        // Check for detailed components
        if (response.body.components) {
          expect(response.body.components).to.have.property('diskSpace');
          expect(response.body.components).to.have.property('ping');
          
          // Validate disk space component
          if (response.body.components.diskSpace) {
            expect(response.body.components.diskSpace).to.have.property('status');
            expect(response.body.components.diskSpace.status).to.eq('UP');
          }
        }
      });
    });

    it('should provide metrics endpoint', () => {
      cy.request({
        method: 'GET',
        url: 'http://localhost:8080/actuator/metrics',
        failOnStatusCode: false
      }).then(response => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('names');
        expect(Array.isArray(response.body.names)).to.be.true;
      });
    });
  });

  afterEach(() => {
    logTestInfo('Advanced API test completed');
  });
}); 