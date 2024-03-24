-- sqlite3
-- Assuming nothing exists yet!
BEGIN TRANSACTION;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
);

CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner INTEGER,
    name TEXT,
    FOREIGN KEY(owner) REFERENCES users(id)
);

CREATE TABLE expenselogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner INTEGER,
    name TEXT,
    FOREIGN KEY(owner) REFERENCES users(id)
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