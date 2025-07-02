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
  })
);
