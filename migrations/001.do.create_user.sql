CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "date_created" TIMESTAMP DEFAULT now() NOT NULL
);
