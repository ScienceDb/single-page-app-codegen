#!/usr/bin/env bash

# Exit on error
set -e

# Load integration test constants
SCRIPT_DIR="$(dirname $(readlink -f ${BASH_SOURCE[0]}))"
source "${SCRIPT_DIR}/testenv_constants.sh"

echo ""
echo -e ${GRAY}${DOUBLE_SEP}${NC}
echo -e ${YELLOW}START ${GRAY}REMOVE TESTING ENVIRONMENT${NC}
echo -e ${GRAY}${DOUBLE_SEP}${NC}
echo ""

# Remove docker containers, images, and volumes
export DOCKER_UID="$DOCKER_UID"
docker-compose -f "${TEST_DIR}/integration_test_misc/docker-compose-test.yml" down -v --rmi all

# Remove testing environment
echo "Removing ${ENV_DIR}"
rm -rf ${ENV_DIR}

echo ""
echo -e ${GRAY}${DOUBLE_SEP}${NC}
echo -e ${YELLOW}END ${GRAY}REMOVE TESTING ENVIRONMENT${NC}
echo -e ${GRAY}${DOUBLE_SEP}${NC}
echo ""
