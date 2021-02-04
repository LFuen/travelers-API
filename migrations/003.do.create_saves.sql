CREATE TABLE "saves" (
    "id" SERIAL PRIMARY KEY,
    "user_id" VARCHAR REFERENCES user(id),
);