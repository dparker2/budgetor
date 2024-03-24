#!/bin/bash

sqlite3 db/auth.sqlite3 < db/bootstrap-auth.sql
sqlite3 db/auth.sqlite3 "
    INSERT INTO users (email, password) VALUES (
        'dev@local',
        '95e2a4a09239f6c34a9eb4597b0c05167c1495ec861ad252b27841a7c9b213186288216c4759190854737e07a5650c36f91167bbf2562de04f4ab456e7abf596:381a2912d6281967cffcf185e76ed2d4'
    );
"

sqlite3 db/users/1.sqlite3 < db/bootstrap-user.sql
sqlite3 db/users/1.sqlite3 "
    INSERT INTO categories (name) VALUES
        ('Household'),
        ('Groceries'),
        ('Gas');

    INSERT INTO expenselogs (name) VALUES
        ('Log 1 (1/1/2024-1/14-2024)'),
        ('Log 2 (1/15/2024-1/28-2024)');

    INSERT INTO expenses (log, date, amount, description, category) VALUES
        (1, '1/1/2024', 100, 'Target', 1),
        (1, '1/15/2024', 200, 'Walmart', 2),
        (2, '1/15/2024', 300, 'Costco Gas', 3);
"
