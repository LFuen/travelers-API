CREATE TABLE "guide" (
    "pid" SERIAL PRIMARY KEY,
    "guide_type" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL,
    "comments" TEXT NOT NULL,
    "date_created" TIMESTAMP,
    "like_user_id" INT[] DEFAULT ARRAY[]::INT[],
    "likes" INT DEFAULT 0,
    "author" INT,
    FOREIGN KEY("author") REFERENCES "user"(id)
);