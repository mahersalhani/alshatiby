/**
 * program controller
 */

import { Core } from "@strapi/strapi";
declare const strapi: Core.Strapi;

const transformSupervisors = (supervisors: any[]) => {
  return supervisors?.map((supervisor) => ({
    id: supervisor.id,
    documentId: supervisor.documentId,
    role: supervisor.role,
    name: supervisor.user?.name,
    email: supervisor.user?.email,
    gender: supervisor.user?.gender,
    birthday: supervisor.user?.birthday,
    phoneNumber: supervisor.user?.phoneNumber,
  })) || [];
};

export default {
  async find(ctx) {
    const { query } = ctx;
    const { filters, pagination, sort } = query as any;

    const programs = await strapi.service("api::program.program").find({
      filters,
      pagination,
      sort,
      populate: {
        supervisors: {
          populate: {
            user: {
              fields: ["email", "name", "gender", "birthday", "phoneNumber"],
            },
          },
        },
      },
    });

    if (programs.results) {
      programs.results = programs.results.map((program) => ({
        ...program,
        supervisors: transformSupervisors(program.supervisors),
      }));
    }

    return programs;
  },
  async findOne(ctx) {
    const { id } = ctx.params;
    const entity = await strapi.service("api::program.program").findOne(id, {
      populate: {
        supervisors: {
          populate: {
            user: {
              fields: ["email", "name", "gender", "birthday", "phoneNumber"],
            },
          },
        },
      },
    });

    if (entity) {
      entity.supervisors = transformSupervisors(entity.supervisors);
    }

    return entity;
  },
  async update(ctx) {
    const { id } = ctx.params;
    const data = ctx.request.body;
    
    const updated = await strapi.service("api::program.program").update(id, { 
      data,
      populate: {
        supervisors: {
          populate: {
            user: {
              fields: ["email", "name", "gender", "birthday", "phoneNumber"],
            },
          },
        },
      },
    });

    if (updated) {
      updated.supervisors = transformSupervisors(updated.supervisors);
    }

    return updated;
  },
  async create(ctx) {
    const data = ctx.request.body;

    const program = await strapi
      .documents("api::program.program")
      .create({ 
        data,
        populate: {
          supervisors: {
            populate: {
              user: {
                fields: ["email", "name", "gender", "birthday", "phoneNumber"],
              },
            },
          },
        },
      });

    if (program) {
      program.supervisors = transformSupervisors(program.supervisors);
    }

    return program;
  },
};
