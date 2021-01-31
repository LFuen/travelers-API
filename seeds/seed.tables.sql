BEGIN;

INSERT INTO "user" (id, name, username, password)
VALUES
    (
        1,
        'Lili',
        'admin',
        '$2a$04$IZJWZUiBkBuKfyJU0XV9Xexr2BmGsCBnt1vRIzI9ncV3rBQeDqtbi'
    );

INSERT INTO "guide" (id, guide_type, city, recommend, comments)
VALUES
    (
        1,
        'Food',
        'Miami',
        'Frankie''s Pizza',
        'This is probably THE best pizza place in all of Miami. But only if you''re a fan of Italian-style square pizza!'
    ),
    (
        2,
        'Stay',
        'Miami Beach',
        'Marriott Miami Beach',
        'This place is amazing and the staff is great.'
    ),
    (
        3,
        'Sites',
        'Key Biscayne',
        'El Farito Lighthouse',
        'A pretty cool site that mostly attracts locals.'
    ),
    (
        4,
        'Tips & Tricks',
        'Miami',
        'Transportation',
        'Rent a car. DO NOT depend on any form of public transportation, ESPECIALLY the bus system!'
    );

COMMIT;