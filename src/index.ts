import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";

import { Index, AppIndex } from "./views";
import { User } from "./models";

const elysia = new Elysia()
  .use(html())
  .get("/", () => {
    return Index();
  })
  .post(
    "/login",
    ({ body, set, cookie }) => {
      const sessionId = User.authenticate(body.email, body.password);
      if (sessionId) {
        cookie.session.value = sessionId;
        set.status = 303;
        set.headers["Location"] = "/app";
      }
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),
    }
  )
  .get("/test", ({ set, cookie }) => {
    if (!cookie.session?.value || !User.sessions[cookie.session.value]) {
      set.status = 401;
      console.log(set);
      return Index();
    }
  })
  .group(
    "/app",
    {
      beforeHandle({ set, cookie }) {
        if (!cookie.session?.value || !User.sessions[cookie.session.value]) {
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
          return AppIndex({ name: user.email.split("@")[0] });
        })
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${elysia.server?.hostname}:${elysia.server?.port}`
);
