#!/bin/bash

psql -U lili -d travellers -f ./migrations/003.undo.create_saves.sql
psql -U lili -d travellers -f ./migrations/002.undo.create_guide.sql
psql -U lili -d travellers -f ./migrations/001.undo.create_user.sql

psql -U lili -d travellers -f ./migrations/001.do.create_user.sql
psql -U lili -d travellers -f ./migrations/002.do.create_guide.sql
psql -U lili -d travellers -f ./migrations/003.do.create_saves.sql

psql -U lili -d travellers -f ./seeds/seed.tables.sql