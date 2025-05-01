include .env

COMPOSE_FILE=docker-compose.yml

up:
	COMPOSE_PROJECT_NAME=$(COMPOSE_PROJECT_NAME) docker-compose -f $(COMPOSE_FILE) up -d

down:
	COMPOSE_PROJECT_NAME=$(COMPOSE_PROJECT_NAME) docker-compose -f $(COMPOSE_FILE) down

clear:
	COMPOSE_PROJECT_NAME=$(COMPOSE_PROJECT_NAME) docker-compose -f $(COMPOSE_FILE) down -v

restart:
	COMPOSE_PROJECT_NAME=$(COMPOSE_PROJECT_NAME) docker-compose -f $(COMPOSE_FILE) down && \
	COMPOSE_PROJECT_NAME=$(COMPOSE_PROJECT_NAME) docker-compose -f $(COMPOSE_FILE) up -d

logs:
	COMPOSE_PROJECT_NAME=$(COMPOSE_PROJECT_NAME) docker-compose -f $(COMPOSE_FILE) logs -f

status:
	COMPOSE_PROJECT_NAME=$(COMPOSE_PROJECT_NAME) docker-compose -f $(COMPOSE_FILE) ps

singlestore-init:
	docker exec $(COMPOSE_PROJECT_NAME)-singlestore-1 memsql -u root -p$(SINGLESTORE_PASSWORD) -e "CREATE DATABASE IF NOT EXISTS $(SINGLESTORE_DB);"
