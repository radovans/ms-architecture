#!/bin/bash

# Keycloak Docker container name
CONTAINER_NAME="keycloak"
REALM_NAME="ms-architecture"
EXPORT_DIR="/tmp/keycloak-export"
DB_URL="jdbc:postgresql://keycloak_postgres:5432/keycloak"
DB_USER="keycloak"
DB_PASS="keycloak_password"
KC_PATH="/opt/keycloak/bin/kc.sh"

print_help() {
  echo "Usage: ./keycloak [export|import|help]"
  echo ""
  echo "Commands:"
  echo "  export    Export the Keycloak realm"
  echo "  import    Import the Keycloak realm"
  echo "  help      Show this help message"
}

export_realm() {
  echo "Exporting Keycloak realm '$REALM_NAME'..."
  docker exec -it $CONTAINER_NAME $KC_PATH export \
    --realm $REALM_NAME \
    --dir $EXPORT_DIR \
    --users realm_file \
    --db postgres \
    --db-url $DB_URL \
    --db-username $DB_USER \
    --db-password $DB_PASS
}

import_realm() {
  echo "Importing Keycloak realm from '$EXPORT_DIR'..."
  docker exec -it $CONTAINER_NAME $KC_PATH import \
    --dir $EXPORT_DIR \
    --db postgres \
    --db-url $DB_URL \
    --db-username $DB_USER \
    --db-password $DB_PASS \
    -Dkeycloak.migration.action=import \
    -Dkeycloak.migration.provider=singleFile \
    -Dkeycloak.migration.realmName=$REALM_NAME \
    -Dkeycloak.migration.file=$EXPORT_DIR/${REALM_NAME}-realm.json
}

case "$1" in
  export)
    export_realm
    ;;
  import)
    import_realm
    ;;
  help|*)
    print_help
    ;;
esac
