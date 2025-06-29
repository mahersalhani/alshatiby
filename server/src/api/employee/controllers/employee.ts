/**
 * employee controller
 */

import { factories } from "@strapi/strapi";
import bcrypt from "bcryptjs";

export default factories.createCoreController(
  "api::employee.employee",
  ({ strapi }) => ({
    async create(ctx) {
      const { body } = ctx.request;
      // console.log("Creating employee with body:", body);
      // // const { data, meta } = await strapi.service('api::employee.employee').create(body);
      // // ctx.created({ data, meta });
      console.log("Creating employee with body:", body);

      const employeeData = await strapi
        .service("api::employee.employee")
        .create({
          data: {
            firstName: body.firstName,
            lastName: body.lastName,
            // email: body.email,
            phoneNumber: body.phoneNumber,
            role: body.role,
            // password: body.password,
          },
        });

      const hashedPassword = await bcrypt.hash(body.password, 10);
      console.log("Hashed password:", hashedPassword);

      // const newUser = await strapi.db
      //   .query("plugin::users-permissions.user")
      //   .create({
      //     data: {
      //       username: body.email,
      //       email: body.email,
      //       password: hashedPassword,
      //       confirmed: true,
      //       role: "Authenticated", // assign correct role ID
      //       employee: employeeData.id,
      //       provider: "local",
      //       created_by_id: ctx.state.user?.id || 1,
      //       updated_by_id: ctx.state.user?.id || 1,
      //     },
      //   });
      const userData = await strapi
        .documents("plugin::users-permissions.user")
        .create({
          data: {
            username: body.email,
            email: body.email,
            password: body.password,
            employee: employeeData.id,
            confirmed: true,
            role: "Authenticated",
          },
        });

      console.log("Employee created:", employeeData, userData);

      return { success: true };
    },
  })
);
