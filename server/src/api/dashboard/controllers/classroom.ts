/**
 * classroom controller
 */

import { Core } from "@strapi/strapi";

declare const strapi: Core.Strapi;

export default {
  async findTeacherClassrooms(ctx) {
    const { user } = ctx.state;

    const classrooms = await strapi.service("api::classroom.classroom").find({
      filters: {
        teacher: {
          user: user.id,
        },
      },
      populate: {
        program: {},
        schedules: {},
        studentSchedules: {
          fields: ["id", "documentId"],
          populate: {
            student: {
              fields: ["id", "documentId"],
            },
          },
        },
      },
    });

    return classrooms;
  },
  async findTeacherClassroom(ctx) {
    const { user } = ctx.state;
    const { classroomId } = ctx.params;

    const data = await strapi.service("api::classroom.classroom").find({
      filters: {
        teacher: {
          user: user.id,
        },
        documentId: classroomId,
      },
      populate: {
        program: {},
        schedules: {},
        studentSchedules: {
          fields: ["id"],
          populate: {
            student: {
              fields: ["id"],
              populate: {
                user: {
                  fields: ["email", "name", "gender", "birthday"],
                },
              },
            },
          },
        },
      },
      limit: 1,
    });

    const [classroom] = data?.results || [];

    return classroom;
  },
  async create(ctx) {
    const data = ctx.request.body;

    const classroom = await strapi
      .documents("api::classroom.classroom")
      .create({ data });

    return classroom;
  },
  async find(ctx) {
    const { query } = ctx;
    const { filters, pagination, sort } = query as any;

    const data = await strapi.service("api::classroom.classroom").find({
      filters,
      pagination,
      sort,
    });

    return data;
  },
};
