import { type PropsWithChildren } from "@kitajs/html";
import { type Expense, type ExpenseLog } from "./models";

function Page({ children }: PropsWithChildren) {
    return (
        <html lang="en" data-bs-theme="dark">
            <head>
                <meta charset="utf-8"></meta>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                ></meta>
                <title>Hello World</title>
                <link
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
                    rel="stylesheet"
                    integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
                    crossorigin="anonymous"
                ></link>
                <script
                    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
                    integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
                    crossorigin="anonymous"
                ></script>
                <script
                    src="https://unpkg.com/htmx.org@1.9.11"
                    integrity="sha384-0gxUXCCR8yv9FM2b+U3FDbsKthCI66oH5IA9fHppQq9DDMHuMauqq1ZHBpJxQ0J0"
                    crossorigin="anonymous"
                ></script>
            </head>
            <body>
                {children}
                <div
                    aria-live="polite"
                    aria-atomic="true"
                    class="position-absolute top-0 w-100"
                >
                    <div class="toast-container top-0 end-0 p-3"></div>
                </div>
                <script>{`
                    document.addEventListener('htmx:beforeSwap', function (evt) {
                        if (evt.detail.xhr.status === 401 || evt.detail.xhr.status === 422) {
                            evt.detail.shouldSwap = true;
                            evt.detail.isError = false;
                        }
                    })
                    function addLog() {
                        var formItem = document.getElementById("new-log-form").firstChild.cloneNode(true);
                        document.getElementById("expense-log-list").prepend(formItem);
                        htmx.process(formItem);
                        formItem.querySelector("input").focus();
                    }
                `}</script>
            </body>
        </html>
    );
}

export function Toast({ text }: { text: string }) {
    return (
        <div
            class="toast show"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
        >
            <div class="toast-header">
                <strong class="me-auto">Bootstrap</strong>
                <small class="text-body-secondary">2 seconds ago</small>
                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="toast"
                    aria-label="Close"
                ></button>
            </div>
            <div class="toast-body">{text}</div>
        </div>
    );
}

export function Login({
    email = "",
    password = "",
    invalid = false,
}: {
    email?: string;
    password?: string;
    invalid?: boolean;
} = {}) {
    return (
        <form hx-post="/login">
            <div class="mb-3">
                <label for="email" class="form-label">
                    Email address
                </label>
                <input
                    type="email"
                    class={`form-control ${invalid ? "is-invalid" : ""}`}
                    id="email"
                    name="email"
                    placeholder="name@example.com"
                    value={email}
                />
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">
                    Password
                </label>
                <input
                    type="password"
                    class={`form-control ${invalid ? "is-invalid" : ""}`}
                    name="password"
                    id="password"
                    value={password}
                />
                {invalid && (
                    <div class="invalid-feedback d-block">
                        Invalid email or password.
                    </div>
                )}
            </div>

            <div class="d-flex">
                <button type="submit" name="login" class="btn btn-primary">
                    Login
                </button>
                <button
                    type="submit"
                    name="register"
                    class="btn btn-secondary ms-auto"
                >
                    Register
                </button>
            </div>
        </form>
    );
}

export function Index() {
    return (
        <Page>
            <div class="min-vh-100 d-flex align-items-center justify-content-center">
                <Login />
            </div>
        </Page>
    );
}

export function ExpenseLogListItem({ log }: { log: ExpenseLog }) {
    return (
        <li class="list-group-item">
            <a href={`/app/logs/${log.id}`}>{log.name}</a>
        </li>
    );
}

function AppPage({
    username,
    children,
}: PropsWithChildren<{
    username: string;
}>) {
    return (
        <Page>
            <div class="container min-vh-100 d-flex flex-column">
                <div class="row">
                    <div class="col">
                        <h1>Hello {username}</h1>
                    </div>
                </div>
                <div class="row flex-grow-1">
                    <div class="col d-flex flex-column">{children}</div>
                </div>
            </div>
        </Page>
    );
}

export function ExpenseLogListPage({
    username,
    logs,
}: {
    username: string;
    logs: ExpenseLog[];
}) {
    return (
        <AppPage username={username}>
            <div class="row flex-grow-1">
                <div class="col">
                    <div class="d-flex justify-content-between">
                        <nav aria-label="breadcrumb">
                            <h3>
                                <ol class="breadcrumb">
                                    <li
                                        class="breadcrumb-item active"
                                        aria-current="page"
                                    >
                                        Expenses
                                    </li>
                                </ol>
                            </h3>
                        </nav>
                        <div
                            class="btn-group d-none d-sm-block text-end"
                            role="group"
                        >
                            <button
                                type="button"
                                class="btn btn-secondary mb-2"
                                onclick="addLog()"
                            >
                                + Add
                            </button>
                        </div>
                    </div>
                    <ul id="expense-log-list" class="list-group">
                        {logs.map((log) => (
                            <ExpenseLogListItem log={log} />
                        ))}
                    </ul>
                </div>
            </div>
            <div class="row d-sm-none">
                <div class="btn-group" role="group">
                    <button type="button" class="btn btn-secondary">
                        Left
                    </button>
                    <button type="button" class="btn btn-secondary">
                        Middle
                    </button>
                    <button type="button" class="btn btn-secondary">
                        Right
                    </button>
                </div>
            </div>
            <div id="new-log-form" class="d-none">
                <li class="list-group-item">
                    <form
                        hx-post="/app/logs"
                        hx-target="closest li"
                        hx-swap="outerHTML"
                        class="d-flex"
                    >
                        <input
                            type="text"
                            class="form-control"
                            name="name"
                            placeholder="Name"
                        />
                        <button type="submit" class="btn btn-primary">
                            Save
                        </button>
                    </form>
                </li>
            </div>
        </AppPage>
    );
}

export function ExpensesPage({
    username,
    log,
    expenses,
}: {
    username: string;
    log: ExpenseLog;
    expenses: Expense[];
}) {
    return (
        <AppPage username={username}>
            <div class="col d-flex flex-column">
                <div class="row flex-grow-1">
                    <div class="col">
                        <div class="d-flex justify-content-between">
                            <h3>
                                <ol class="breadcrumb">
                                    <li class="breadcrumb-item">
                                        <a href="/app">Expenses</a>
                                    </li>
                                    <li
                                        class="breadcrumb-item active"
                                        aria-current="page"
                                    >
                                        {log.name}
                                    </li>
                                </ol>
                            </h3>
                            <div
                                class="btn-group d-none d-sm-block text-end"
                                role="group"
                            >
                                <button
                                    type="button"
                                    class="btn btn-secondary mb-2"
                                >
                                    + Add
                                </button>
                            </div>
                        </div>
                        <ul id="expense-log-list" class="list-group">
                            {expenses.map((expense) => (
                                <li class="list-group-item">
                                    {expense.description}
                                    <br />${expense.amount}
                                    <br />
                                    {new Date(
                                        expense.date
                                    ).toLocaleDateString()}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div class="row d-sm-none">
                    <div class="col">
                        <div class="row">
                            <div class="btn-group" role="group">
                                <button type="button" class="btn btn-secondary">
                                    Left
                                </button>
                                <button type="button" class="btn btn-secondary">
                                    Middle
                                </button>
                                <button type="button" class="btn btn-secondary">
                                    Right
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppPage>
    );
}
