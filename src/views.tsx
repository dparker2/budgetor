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

export function ExpenseLogList({ logs }: { logs: ExpenseLog[] }) {
    return (
        <div class="col d-flex flex-column">
            <div class="row flex-grow-1">
                <div class="col">
                    <div
                        class="btn-group d-none d-sm-block text-end"
                        role="group"
                    >
                        <button type="button" class="btn btn-secondary">
                            + Add
                        </button>
                    </div>
                    <ul class="list-group">
                        {logs.map((log) => (
                            <li class="list-group-item">
                                <a href="#">{log.name}</a>
                            </li>
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
        </div>
    );
}

export function AppIndex({ name, logs }: { name: string; logs: ExpenseLog[] }) {
    return (
        <Page>
            <div class="container-fluid min-vh-100 d-flex flex-column">
                <div class="row">
                    <div class="col">
                        <h1>Hello {name}</h1>
                    </div>
                </div>
                <div class="row flex-grow-1">
                    <ExpenseLogList logs={logs} />
                </div>
            </div>
        </Page>
    );
}
