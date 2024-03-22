import { randomBytes } from "crypto";

export class User {
  static sessions: Record<string, User> = {};

  email: string;

  constructor(email: string) {
    this.email = email;
  }

  static authenticate(email: string, _password: string) {
    const sessionId = randomBytes(16).toString("hex");
    this.sessions[sessionId] = new User(email);
    return sessionId;
  }
}
