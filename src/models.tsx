import { Database } from "bun:sqlite";
import { scryptSync, randomBytes, timingSafeEqual } from "crypto";

const db = new Database("db/db.sqlite");

export class User {
    static sessions: Record<string, User> = {};

    id: number;
    email: string;

    constructor(id: number, email: string) {
        this.email = email;
        this.id = id;
    }

    static register(email: string, password: string) {
        const salt = randomBytes(16).toString("hex");
        const hash = scryptSync(password, salt, 64).toString("hex");
        db.run("INSERT INTO users (email, password) VALUES (?, ?)", [
            email,
            `${hash}:${salt}`,
        ]);
    }

    static authenticate(email: string, password: string) {
        const record = db
            .query<{ id: number; password: string }, string>(
                "SELECT id, password FROM users WHERE email = ?"
            )
            .get(email);
        if (!record) {
            return false;
        }
        const [hash, salt] = record.password.split(":");
        const hashVerify = scryptSync(password, salt, 64);
        if (!timingSafeEqual(Buffer.from(hash, "hex"), hashVerify)) {
            return false;
        }

        const sessionId = randomBytes(16).toString("hex");
        this.sessions[sessionId] = new User(record.id, email);
        return sessionId;
    }

    getLogs(): ExpenseLog[] {
        return db
            .query<ExpenseLog, number>(
                "SELECT * FROM expenselogs WHERE owner = ? ORDER BY id DESC"
            )
            .all(this.id);
    }

    getLog(id: number) {
        return db
            .query<ExpenseLog, [number, number]>(
                "SELECT * FROM expenselogs WHERE owner = ? AND id = ?"
            )
            .get(this.id, id);
    }

    addLog(name: string): ExpenseLog {
        return db
            .query<ExpenseLog, [number, string]>(
                "INSERT INTO expenselogs (owner, name) VALUES (?, ?) RETURNING id, name"
            )
            .get(this.id, name)!;
    }

    getExpenses(logId: number): Expense[] {
        return db
            .query<Expense, [number, number]>(
                `SELECT expenses.id, expenses.date, expenses.amount, expenses.description, categories.name FROM expenses
                JOIN expenselogs ON expenselogs.id=expenses.log
                JOIN categories ON (expenses.category=categories.id AND categories.owner=expenselogs.owner)
            WHERE expenselogs.owner=? AND expenselogs.id=?`
            )
            .all(this.id, logId);
    }
}

export interface ExpenseLog {
    id: number;
    name: string;
}

export interface Expense {
    id: number;
    date: number;
    amount: Date;
    description: string;
    category: string;
}
