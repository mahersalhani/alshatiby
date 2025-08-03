/**
 * student controller
 */

import { Core } from "@strapi/strapi";
import _ from "lodash";
declare const strapi: Core.Strapi;

export default {
  async create(ctx) {
    const res = await strapi
      .service("api::student.student")
      .createStudent(ctx.request.body);
    return res;
  },
  async find(ctx) {
    const { query } = ctx;
    const { filters, pagination, sort } = query as any;

    const data = await strapi.service("api::student.student").find({
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

    data.results = data.results.map((student) => {
      const user = student.user || {};
      return {
        ...user,
        ...student,
      };
    });

    return data;
  },
  async update(ctx) {
    const { id } = ctx.params;
    const { email, ...studentData } = ctx.request.body;

    // check if email is used
    const [existingUser] = await strapi
      .documents("plugin::users-permissions.user")
      .findMany({
        filters: { email },
        limit: 1,
        populate: ["student"],
      });

    if (existingUser && existingUser.student.documentId !== id) {
      return ctx.badRequest("error.email_already_in_use");
    }

    const student = await strapi.service("api::student.student").update(id, {
      data: studentData,
    });

    await strapi.documents("plugin::users-permissions.user").update({
      documentId: existingUser.documentId,
      data: {
        email,
        ..._.omit(studentData, ["role"]),
      },
    });

    return student;
  },
  async findOne(ctx) {
    const { populate } = ctx.query;

    const student = await strapi
      .documents("api::student.student")
      .findOne({ documentId: ctx.params.id, populate });

    return student;
  },
  async updateStudentPassword(ctx) {
    const res = await strapi
      .service("api::student.student")
      .updateStudentPassword(ctx);

    return res;
  },
};
