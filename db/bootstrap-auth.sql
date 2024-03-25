BEGIN TRANSACTION;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
);

CREATE TABLE sessions (
    hash TEXT UNIQUE,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

COMMIT;