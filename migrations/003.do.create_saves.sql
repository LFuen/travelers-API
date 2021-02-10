CREATE TABLE "saves" (
    "liked" BOOLEAN,
    "guide_id" INTEGER REFERENCES "guide"(id),
    "user_id" INTEGER REFERENCES "user"(id),
    UNIQUE(guide_id, user_id)
);