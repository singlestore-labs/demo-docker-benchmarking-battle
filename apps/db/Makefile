include .env

COMPOSE_FILE = docker-compose.yml

up:
	docker-compose -f $(COMPOSE_FILE) up -d
down:
	docker-compose -f $(COMPOSE_FILE) down
clear:
	docker-compose -f $(COMPOSE_FILE) down -v
restart:
	docker-compose -f $(COMPOSE_FILE) down && docker-compose -f $(COMPOSE_FILE) up -d
logs:
	docker-compose -f $(COMPOSE_FILE) logs -f
status:
	docker-compose -f $(COMPOSE_FILE) ps
singlestore-init:
	docker exec singlestore memsql -u root -p$(SINGLESTORE_PASSWORD) -e "CREATE DATABASE IF NOT EXISTS $(SINGLESTORE_DB);"