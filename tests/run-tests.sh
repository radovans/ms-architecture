#!/bin/bash

# Cypress Test Runner Script
# This script helps run Cypress tests with proper service setup

set -e

echo "🚀 Starting Cypress API Tests..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    npm install
fi

# Function to check if service is running
check_service() {
    local max_attempts=30
    local attempt=1
    
    print_status "Checking if Spring Boot service is running..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s http://localhost:8080/actuator/health > /dev/null 2>&1; then
            print_status "✅ Service is running and healthy!"
            return 0
        fi
        
        print_warning "Service not ready (attempt $attempt/$max_attempts). Waiting..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    print_error "❌ Service failed to start or is not responding"
    print_status "Please ensure your Spring Boot application is running on port 8080"
    return 1
}

# Function to run tests
run_tests() {
    local test_type=$1
    
    case $test_type in
        "open")
            print_status "Opening Cypress Test Runner..."
            npm run test:open
            ;;
        "headless")
            print_status "Running tests in headless mode..."
            npm run test:headless
            ;;
        "hello")
            print_status "Running hello service tests..."
            npm run test:hello
            ;;
        "all")
            print_status "Running all tests..."
            npm test
            ;;
        *)
            print_error "Invalid test type. Use: open, headless, hello, or all"
            exit 1
            ;;
    esac
}

# Main execution
main() {
    local test_type=${1:-"all"}
    
    print_status "Starting Cypress test runner..."
    
    # Check service health
    if ! check_service; then
        exit 1
    fi
    
    # Run tests
    run_tests $test_type
    
    print_status "✅ Tests completed!"
}

# Show usage if no arguments provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 [test_type]"
    echo ""
    echo "Test types:"
    echo "  all      - Run all tests (default)"
    echo "  open     - Open Cypress Test Runner GUI"
    echo "  headless - Run tests in headless mode"
    echo "  hello    - Run only hello service tests"
    echo ""
    echo "Examples:"
    echo "  $0              # Run all tests"
    echo "  $0 open         # Open GUI"
    echo "  $0 hello        # Run hello service tests"
    exit 0
fi

# Run main function with arguments
main "$@" 