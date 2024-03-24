import { Elysia, error, t } from "elysia";
import { html } from "@elysiajs/html";

import {
    Index,
    ExpenseLogListPage,
    Login,
    Toast,
    ExpenseLogListItem,
    ExpensesPage,
} from "./views";
import { User } from "./models";

const elysia = new Elysia()
    .use(html())
    .onError(({ error }) => {
        console.error("[ERROR]");
        console.error(error);
    })
    .onResponse((ctx) => {
        console.log("[RESPONSE]", ctx.path);
        console.log((ctx as any).response);
    })
    .get("/", () => {
        return Index();
    })
    .post(
        "/login",
        ({ body, set, cookie, error }) => {
            if ("register" in body) {
                User.register(body.email, body.password);
                console.log("[REGISTERED]", body.email);
                return Login();
            }

            if ("login" in body) {
                let sessionId;
                if (
                    (sessionId = User.authenticate(body.email, body.password))
                ) {
                    cookie.session.value = sessionId;
                    set.status = 303;
                    set.headers["HX-Location"] = "/app";
                    return;
                }

                return error(
                    401,
                    Login({
                        email: body.email,
                        password: body.password,
                        invalid: true,
                    })
                );
            }

            set.status = 400;
        },
        {
            body: t.Object({
                email: t.String(),
                password: t.String(),
                login: t.Optional(t.String()),
                register: t.Optional(t.String()),
            }),
        }
    )
    .group(
        "/app",
        {
            beforeHandle({ set, cookie }) {
                if (
                    !cookie.session?.value ||
                    !User.sessions[cookie.session.value]
                ) {
                    set.status = 303;
                    set.headers["Location"] = "/";
                    return set.status;
                }
            },
        },
        (app) =>
            app
                .resolve(({ cookie }) => {
                    return {
                        user: User.sessions[cookie.session.value],
                    };
                })
                .get("/", ({ user }) => {
                    return ExpenseLogListPage({
                        username: user.username,
                        logs: user.getLogs(),
                    });
                })
                .post(
                    "/logs",
                    ({ user, body }) => {
                        return ExpenseLogListItem({
                            log: user.addLog(body.name),
                        });
                    },
                    {
                        body: t.Object({
                            name: t.String(),
                        }),
                    }
                )
                .get("/logs/:id", ({ user, params }) => {
                    const log = user.getLog(Number(params.id));
                    if (log === null) {
                        return error(404);
                    }
                    return ExpensesPage({
                        username: user.username,
                        log,
                        expenses: log.getExpenses(),
                    });
                })
    )
    .listen(3000);

console.log(
    `🦊 Elysia is running at ${elysia.server?.hostname}:${elysia.server?.port}`
);
