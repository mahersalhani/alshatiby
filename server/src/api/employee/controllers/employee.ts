/**
 * employee controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::employee.employee",
  ({ strapi }) => ({
    async getAuthenticatedRole() {
      const userRoleService = strapi.plugins["users-permissions"].services.role;
      const roles = await userRoleService.find("Authenticated");
      return roles?.find((role) => role.type === "authenticated");
    },

    async create(ctx) {
      const { email, username, password, ...employeeData } = ctx.request.body;

      // check if email is used
      const [existingUser] = await strapi
        .documents("plugin::users-permissions.user")
        .findMany({
          filters: { email },
          limit: 1,
        });

      if (existingUser) return ctx.badRequest("error.email_already_in_use");

      const authenticatedRole = await this.getAuthenticatedRole();

      const employee = await strapi.service("api::employee.employee").create({
        data: employeeData,
      });
      await strapi.documents("plugin::users-permissions.user").create({
        data: {
          username: email,
          email: email,
          password,
          employee: employee.id,
          confirmed: true,
          role: authenticatedRole,
          provider: "local",
        },
      });

      return employee;
    },
    async find(ctx) {
      const { query } = ctx;
      const { filters, pagination, sort } = query as any;

      const data = await strapi.service("api::employee.employee").find({
        filters,
        pagination,
        sort,
        populate: {
          user: {
            fields: ["email"],
          },
        },
      });

      return data;
    },
    async update(ctx) {
      const { id } = ctx.params;
      const { email, ...employeeData } = ctx.request.body;

      // check if email is used
      const [existingUser] = await strapi
        .documents("plugin::users-permissions.user")
        .findMany({
          filters: { email },
          limit: 1,
          populate: ["employee"],
        });

      if (existingUser && existingUser.employee.documentId !== id) {
        return ctx.badRequest("error.email_already_in_use");
      }

      const employee = await strapi
        .service("api::employee.employee")
        .update(id, {
          data: employeeData,
        });

      if (email) {
        await strapi.documents("plugin::users-permissions.user").update({
          documentId: employee.documentId,
          data: { email },
        });
      }

      return employee;
    },
  })
);
