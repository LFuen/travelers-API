BEGIN;

INSERT INTO "user" (username, password)
VALUES
    (
        'admin',
        '$2a$12$5qOEHRGjZDJsafxlEWqJheBvO4uq1wNegmlZfXYK/w7L8YiLe/JOW'
    );

INSERT INTO "guide" (guide_type, city, recommendation, comments, author)
VALUES
    (
        'Food',
        'Miami',
        'Frankie''s Pizza',
        'This is probably THE best pizza place in all of Miami. But only if you''re a fan of Italian-style square pizza!',
        1
    ),
    (
        'Stay',
        'Miami Beach',
        'Marriott Miami Beach',
        'This place is amazing and the staff is great.',
        1
    ),
    (
        'Sites',
        'Key Biscayne',
        'El Farito Lighthouse',
        'A pretty cool site that mostly attracts locals.',
        1
    ),
    (
        'Tips & Tricks',
        'Miami',
        'Transportation',
        'Rent a car. DO NOT depend on any form of public transportation, ESPECIALLY the bus system!',
        1
    );

COMMIT;