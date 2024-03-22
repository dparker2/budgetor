import { type PropsWithChildren } from "@kitajs/html";

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
      <body>{children}</body>
    </html>
  );
}

export function Login() {
  return (
    <form hx-post="/login" hx-push-url="true" hx-target="body">
      <div class="mb-3">
        <label for="email" class="form-label">
          Email address
        </label>
        <input
          type="email"
          class="form-control"
          id="email"
          name="email"
          placeholder="name@example.com"
        />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">
          Password
        </label>
        <input
          type="password"
          class="form-control"
          name="password"
          id="password"
        />
      </div>
      <button type="submit" class="btn btn-primary">
        Login
      </button>
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

export function AppIndex({ name }: { name: string }) {
  return (
    <Page>
      <div class="container min-vh-100 d-flex flex-column">
        <div class="row">
          <div class="col">
            <h1>Hello {name}</h1>
          </div>
        </div>
        <div class="row flex-grow-1">
          <ul class="list-group">
            <li class="list-group-item">Cras justo odio</li>
            <li class="list-group-item">Dapibus ac facilisis in</li>
            <li class="list-group-item">Morbi leo risus</li>
            <li class="list-group-item">Porta ac consectetur ac</li>
            <li class="list-group-item">Vestibulum at eros</li>
          </ul>
        </div>
        <div class="row">
          <div class="col">Bottom Toolbar</div>
        </div>
      </div>
    </Page>
  );
}
