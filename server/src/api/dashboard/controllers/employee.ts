/**
 * employee controller
 */

import { Core } from "@strapi/strapi";
import _ from "lodash";
declare const strapi: Core.Strapi;

export default {
  async create(ctx) {
    const res = await strapi
      .service("api::employee.employee")
      .createEmployee(ctx.request.body);
    return res;
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
          fields: [
            "email",
            "name",
            "nationality",
            "residenceCountry",
            "gender",
            "birthday",
            "phoneNumber",
          ],
        },
      },
    });

    data.results = data.results.map((employee) => {
      const user = employee.user || {};
      delete employee.user;
      return {
        ...user,
        ...employee,
      };
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

    const employee = await strapi.service("api::employee.employee").update(id, {
      data: employeeData,
    });

    await strapi.documents("plugin::users-permissions.user").update({
      documentId: existingUser.documentId,
      data: {
        email,
        ..._.omit(employeeData, ["role"]),
      },
    });

    return employee;
  },
  async findOne(ctx) {
    const { populate } = ctx.query;

    const employee = await strapi
      .documents("api::employee.employee")
      .findOne({ documentId: ctx.params.id, populate });

    return employee;
  },
  async updateEmployeePassword(ctx) {
    const res = await strapi
      .service("api::employee.employee")
      .updateEmployeePassword(ctx);

    return res;
  },
};
