# MS Architecture - Microservices Showcase

A comprehensive microservices architecture project demonstrating Java programming skills, modern software engineering practices, and enterprise-level system design.

## Project Structure

```
ms-architecture/
├── backend/             # Backend microservices (Java/Spring Boot)
├── frontend/            # Frontend applications (React/TypeScript)
├── infrastructure/      # Docker, deployment, and infrastructure configs
│   ├── docker/          # Docker Compose and container configs
│   ├── keycloak/        # Keycloak configuration and scripts
│   ├── status-page/     # Status page infrastructure
│   └── collection/      # Postman collections for API testing
├── tests/               # Comprehensive test suites
└── docs/                # Project documentation
```

## Quick Start

### Prerequisites
- Java 21
- Docker & Docker Compose
- Node.js 18+ (for frontend development)

### Local Development Setup

1. **Start Infrastructure Services**
   ```bash
   cd infrastructure/docker
   docker-compose up --build -d
   ```

2. **Setup Keycloak**
   ```bash
   cd infrastructure/keycloak
   sh keycloak.sh import
   ```

3. **Access Services**
   - Keycloak Admin Console: http://localhost:9090
     - Username: `admin`
     - Password: `admin`
   - Status Page: http://localhost:8090

### Export/Import Keycloak realm
- Export Keycloak realm
  ```bash
  cd infrastructure/keycloak
  sh keycloak.sh export
  ```
