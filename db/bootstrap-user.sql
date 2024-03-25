-- sqlite3 per user database
-- Assuming nothing exists yet!
BEGIN TRANSACTION;

CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    color TEXT
);

CREATE TABLE expenselogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
);

CREATE TABLE expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    log INTEGER,
    date DATE,
    amount INTEGER,
    description TEXT,
    category INTEGER,
    FOREIGN KEY(log) REFERENCES expenselogs(id),
    FOREIGN KEY(category) REFERENCES categories(id)
);

COMMIT;