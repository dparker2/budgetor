import { Database } from "bun:sqlite";
import { scryptSync, randomBytes, timingSafeEqual } from "crypto";

const authDb = new Database("db/auth.sqlite3");
const userDbSchema = await Bun.file("db/bootstrap-user.sql").text();

export class User {
    static sessions: Record<string, User> = {};

    id: number;
    email: string;
    db: Database;

    constructor(id: number, email: string) {
        this.email = email;
        this.id = id;
        this.db = new Database(`db/users/${this.id}.sqlite3`, {
            create: false,
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
        return this.db
            .query<ExpenseLog, []>("SELECT * FROM expenselogs ORDER BY id DESC")
            .all();
    }

    getLog(id: number): ExpenseLog | null {
        const record = this.db
            .query<{ name: string }, number>(
                "SELECT name FROM expenselogs WHERE AND id = ?"
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
            SELECT expenses.id, expenses.date, expenses.amount, expenses.description, categories.name FROM expenses
                JOIN expenselogs ON expenselogs.id=expenses.log
                JOIN categories ON expenses.category=categories.id
            WHERE expenselogs.id=?
            `
            )
            .all(this.id);
    }
}

export interface Expense {
    id: number;
    date: number;
    amount: Date;
    description: string;
    category: string;
}
