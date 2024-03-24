import { Database } from "bun:sqlite";
import { scryptSync, randomBytes, timingSafeEqual } from "crypto";

const db = new Database("db/db.sqlite");

export class User {
    static sessions: Record<string, User> = {};

    email: string;

    constructor(email: string) {
        this.email = email;
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
        const storedPass = db
            .query<{ password: string }, string>(
                "SELECT password FROM users WHERE email = ?"
            )
            .get(email);
        if (!storedPass) {
            return false;
        }
        const [hash, salt] = storedPass.password.split(":");
        const hashVerify = scryptSync(password, salt, 64);
        if (!timingSafeEqual(Buffer.from(hash, "hex"), hashVerify)) {
            return false;
        }

        const sessionId = randomBytes(16).toString("hex");
        this.sessions[sessionId] = new User(email);
        return sessionId;
    }

    getLogs(): ExpenseLog[] {
        return [
            new ExpenseLog("1/14/2022 - 1/28/2022", this),
            new ExpenseLog("1/29/2022 - 2/12/2022", this),
            new ExpenseLog("2/13/2022 - 2/27/2022", this),
        ];
    }
}

export class Expense {
    constructor() {}
}

export class ExpenseLog {
    name: string;
    owner: User;
    expenses: Expense[] = [];

    constructor(name: string, owner: User) {
        this.name = name;
        this.owner = owner;
    }
}
