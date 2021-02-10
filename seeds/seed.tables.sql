BEGIN;

INSERT INTO "user" (username, password)
VALUES
    (
        'admin',
        '$2a$04$IZJWZUiBkBuKfyJU0XV9Xexr2BmGsCBnt1vRIzI9ncV3rBQeDqtbi'
    );

INSERT INTO "guide" (guide_type, city, recommendation, comments)
VALUES
    (
        'Food',
        'Miami',
        'Frankie''s Pizza',
        'This is probably THE best pizza place in all of Miami. But only if you''re a fan of Italian-style square pizza!'
    ),
    (
        'Stay',
        'Miami Beach',
        'Marriott Miami Beach',
        'This place is amazing and the staff is great.'
    ),
    (
        'Sites',
        'Key Biscayne',
        'El Farito Lighthouse',
        'A pretty cool site that mostly attracts locals.'
    ),
    (
        'Tips & Tricks',
        'Miami',
        'Transportation',
        'Rent a car. DO NOT depend on any form of public transportation, ESPECIALLY the bus system!'
    );

COMMIT;