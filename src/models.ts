import { Database } from "bun:sqlite";
import { scryptSync, randomBytes, timingSafeEqual } from "crypto";

const authDb = new Database("db/auth.sqlite3");
const userDbSchema = await Bun.file("db/bootstrap-user.sql").text();

export class User {
    id: number;
    username: string;
    email: string;
    db: Database;

    constructor(id: number, email: string) {
        this.email = email;
        this.username = email.split("@")[0];
        this.id = id;
        this.db = new Database(`db/users/${this.id}.sqlite3`, {
            create: false,
            readwrite: true,
        });
    }

    static register(email: string, password: string) {
        const salt = randomBytes(16).toString("hex");
        const hash = scryptSync(password, salt, 64).toString("hex");
        const id = authDb
            .query<{ id: number }, [string, string]>(
                "INSERT INTO users (email, password) VALUES (?, ?) RETURNING id"
            )
            .get(email, `${hash}:${salt}`);
        const userDb = new Database(`db/users/${id}.sqlite3`, { create: true });
        userDb.run(userDbSchema);
    }

    static authenticate(email: string, password: string) {
        const record = authDb
            .query<{ id: number; password: string }, string>(
                "SELECT id, password FROM users WHERE email = ?"
            )
            .get(email);
        if (!record) {
            return 0;
        }
        const [hash, salt] = record.password.split(":");
        const hashVerify = scryptSync(password, salt, 64);

        if (!timingSafeEqual(Buffer.from(hash, "hex"), hashVerify)) {
            return 0;
        }
        return record.id;
    }

    static validateSession(sessionId: string) {
        return !!authDb
            .query("SELECT 1 FROM sessions WHERE hash = ?")
            .get(sessionId);
    }

    static fromSession(sessionId: string) {
        const record = authDb
            .query<{ id: number; email: string }, string>(
                `SELECT users.id, users.email FROM sessions
                    JOIN users ON users.id = sessions.user_id
                WHERE sessions.hash = ?`
            )
            .get(sessionId);
        if (!record) {
            return null;
        }
        return new User(record.id, record.email);
    }

    static removeSession(sessionId: string) {
        authDb.run("DELETE FROM sessions WHERE hash = ?", [sessionId]);
    }

    static newSession(userId: number) {
        const sessionId = randomBytes(16).toString("hex");
        authDb.run<[string, number]>(
            "INSERT INTO sessions (hash, user_id) VALUES (?, ?)",
            [sessionId, userId]
        );
        return sessionId;
    }

    getLogs(): ExpenseLog[] {
        return this.db
            .query<ExpenseLog, []>("SELECT * FROM expenselogs ORDER BY id DESC")
            .all();
    }

    getLog(id: number): ExpenseLog | null {
        const record = this.db
            .query<{ name: string }, number>(
                "SELECT name FROM expenselogs WHERE id = ?"
            )
            .get(id);
        if (!record) {
            return null;
        }
        return new ExpenseLog(id, record.name, this);
    }

    addLog(name: string): ExpenseLog {
        return this.db
            .query<ExpenseLog, string>(
                "INSERT INTO expenselogs (name) VALUES (?) RETURNING id, name"
            )
            .get(name)!;
    }

    getCategories(): Category[] {
        return this.db
            .query<Category, []>("SELECT * FROM categories ORDER BY name")
            .all();
    }
}

export class ExpenseLog {
    id: number;
    owner: User;
    name: string;

    constructor(id: number, name: string, owner: User) {
        this.id = id;
        this.name = name;
        this.owner = owner;
    }

    getExpenses(): Expense[] {
        return this.owner.db
            .query<Expense, number>(
                `
            SELECT expenses.id, expenses.date, expenses.amount, expenses.description, categories.name AS category, categories.color FROM expenses
                JOIN expenselogs ON expenselogs.id=expenses.log
                JOIN categories ON expenses.category=categories.id
            WHERE expenselogs.id=?
            `
            )
            .all(this.id);
    }
}

export interface Category {
    id: number;
    name: string;
    color: string;
}

export interface Expense {
    id: number;
    date: number;
    amount: Date;
    description: string;
    category: string;
    color: string;
}
