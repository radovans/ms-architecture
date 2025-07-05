// Utility functions for Cypress tests

/**
 * Generate a random string for testing
 * @param {number} length - Length of the string
 * @returns {string} Random string
 */
export const generateRandomString = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Generate a random email for testing
 * @returns {string} Random email
 */
export const generateRandomEmail = () => {
  return `test.${generateRandomString(6)}@example.com`;
};

/**
 * Wait for a specific condition with timeout
 * @param {Function} condition - Function that returns true when condition is met
 * @param {number} timeout - Timeout in milliseconds
 * @param {string} message - Error message if timeout occurs
 */
export const waitForCondition = (condition, timeout = 10000, message = 'Condition not met') => {
  const startTime = Date.now();
  
  return new Promise((resolve, reject) => {
    const checkCondition = () => {
      try {
        if (condition()) {
          resolve();
        } else if (Date.now() - startTime > timeout) {
          reject(new Error(message));
        } else {
          setTimeout(checkCondition, 100);
        }
      } catch (error) {
        reject(error);
      }
    };
    
    checkCondition();
  });
};

/**
 * Validate JSON schema
 * @param {Object} data - Data to validate
 * @param {Object} schema - JSON schema
 * @returns {boolean} True if valid
 */
export const validateJsonSchema = (data, schema) => {
  // Simple schema validation - in a real project, you might want to use a library like ajv
  for (const [key, type] of Object.entries(schema)) {
    if (!(key in data)) {
      throw new Error(`Missing required field: ${key}`);
    }
    
    const value = data[key];
    const actualType = typeof value;
    
    if (actualType !== type) {
      throw new Error(`Field ${key} should be ${type}, got ${actualType}`);
    }
  }
  
  return true;
};

/**
 * Log test information
 * @param {string} message - Message to log
 * @param {Object} data - Optional data to log
 */
export const logTestInfo = (message, data = null) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  
  if (data) {
    cy.log(logMessage, data);
  } else {
    cy.log(logMessage);
  }
};

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise} Promise that resolves with function result
 */
export const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}; 