/**
 * student controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::student.student",
  ({ strapi }) => ({
    async create(ctx) {
      // const { email, username, password, ...studentData } = ctx.request.body;
      // // Get the authenticated role
      // const authenticatedRole = await strapi.service('api::student.student').getAuthenticatedRole();
      // // Create the student
      // const student = await strapi.service('api::student.student').create({
      //   data: studentData,
      // });
      // // Create the user document
      // await strapi.documents('plugin::users-permissions.user').create({
      //   data: {
      //     username: email,
      //     email: email,
      //     password,
      //     student: student.id,
      //     confirmed: true,
      //     role: authenticatedRole,
      //     provider: 'local',
      //   },
      // });
      // return student;
    },
  })
);
