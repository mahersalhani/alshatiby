// File: src/extensions/users-permissions/controllers/auth.ts

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "plugin::users-permissions.auth" as any,
  ({ strapi }) => ({
    async register(ctx) {
      const { email, password } = ctx.request.body;

      console.log(
        "Registering user with email: ",
        email,
        " and password: ",
        password
      );

      if (!email || !password) {
        return ctx.badRequest("Missing email or password");
      }

      const existingUser = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: { email },
        });

      if (existingUser) {
        return ctx.badRequest("Email already in use.");
      }

      const user = await strapi
        .plugin("users-permissions")
        .service("user")
        .add({ email, password });

      ctx.body = {
        user,
      };
    },
  })
);
