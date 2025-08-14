/**
 * program controller
 */

import { Core } from "@strapi/strapi";
declare const strapi: Core.Strapi;

export default {
  async find(ctx) {
    const { query } = ctx;
    const { filters, pagination, sort } = query as any;

    const programs = await strapi.service("api::program.program").find({
      filters,
      pagination,
      sort,
    });

    return programs;
  },
};
