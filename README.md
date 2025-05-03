# Spring Boot Microservices Example

## Description
This project demonstrates a simple microservice architecture using Spring Boot. It showcases the core principles of microservices such as 
modularization, scalability, and inter-service communication.

## Prerequisites
- Java 21
- Docker

## Installation
- Clone the repository
- Run the following command to start the services using Docker Compose:
  ```bash
  docker-compose up --build -d
  ```
- Import Keycloak realm into Keycloak
  ```bash
  sh keycloak/keycloak.sh import
  ```

## Keycloak
- Open Keycloak admin console in browser
  ```bash
  open http://localhost:9090/
  ```
- Login with admin credentials
  - Username: `admin`
  - Password: `admin`

### Export/Import Keycloak realm
- Export Keycloak realm
  ```bash
  sh keycloak/keycloak.sh export
  ```
- Import realm into Keycloak
  ```bash
  sh keycloak/keycloak.sh import
  ```