CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL
);