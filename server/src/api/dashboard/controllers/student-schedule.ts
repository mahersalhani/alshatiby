/**
 * student-schedule controller
 */

import { Core } from "@strapi/strapi";

declare const strapi: Core.Strapi;

export default {
  async create(ctx) {
    const body = ctx.request.body;
    return strapi.entityService.create(
      "api::student-schedule.student-schedule",
      {
        data: {
          ...body,
        },
      }
    );
  },
  async delete(ctx) {
    const { id } = ctx.params;
    return strapi
      .documents("api::student-schedule.student-schedule")
      .delete({ documentId: id });
  },
};
