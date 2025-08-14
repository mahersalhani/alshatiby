/**
 * student service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::student.student",
  ({ strapi }) => ({
    async getAuthenticatedRole() {
      const userRoleService = strapi.plugins["users-permissions"].services.role;
      const roles = await userRoleService.find("Authenticated");
      return roles?.find((role) => role.type === "authenticated");
    },
    async createStudent(data: any) {
      return await strapi.db.transaction(async (trx) => {
        const ctx = strapi.requestContext.get();

        const { email, password, ...studentData } = data;

        // check if email is used
        if (email) {
          const [existingUser] = await strapi
            .documents("plugin::users-permissions.user")
            .findMany({
              filters: { email },
              limit: 1,
            });

          if (existingUser) return ctx.badRequest("error.email_already_in_use");
        }

        const authenticatedRole = await this.getAuthenticatedRole();

        const student = await strapi.service("api::student.student").create({
          data: studentData,
        });

        await strapi.db.query("plugin::users-permissions.user").create({
          data: {
            ...studentData,
            email: email,
            password,
            student: student.id,
            confirmed: true,
            role: authenticatedRole,
            provider: "local",
          },
        });

        return student;
      });
    },
    async updateStudentPassword(ctx) {
      const { id } = ctx.params;
      const { password } = ctx.request.body;

      if (!password) {
        return ctx.badRequest("error.password_required");
      }

      // Find the student
      const student = await strapi.service("api::student.student").findOne(id, {
        populate: ["user"],
      });

      if (!student || !student.user) {
        return ctx.notFound("error.student_not_found");
      }

      // Update the user's password
      await strapi.documents("plugin::users-permissions.user").update({
        documentId: student.user.documentId,
        data: { password },
      });

      return student;
    },
  })
);
