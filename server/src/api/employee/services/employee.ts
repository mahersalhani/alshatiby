/**
 * employee service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::employee.employee",
  ({ strapi }) => ({
    async getAuthenticatedRole() {
      const userRoleService = strapi.plugins["users-permissions"].services.role;
      const roles = await userRoleService.find("Authenticated");
      return roles?.find((role) => role.type === "authenticated");
    },
    async createEmployee(data: any) {
      const ctx = strapi.requestContext.get();

      const { email, password, ...employeeData } = data;

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
          ...employeeData,
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
    async updateEmployeePassword(ctx) {
      const { id } = ctx.params;
      const { password } = ctx.request.body;

      if (!password) {
        return ctx.badRequest("error.password_required");
      }

      // Find the employee
      const employee = await strapi
        .service("api::employee.employee")
        .findOne(id, {
          populate: ["user"],
        });

      if (!employee || !employee.user) {
        return ctx.notFound("error.employee_not_found");
      }

      // Update the user's password
      await strapi.documents("plugin::users-permissions.user").update({
        documentId: employee.user.documentId,
        data: { password },
      });

      return employee;
    },
  })
);
