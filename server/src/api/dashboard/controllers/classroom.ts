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

    // get count of studentSchedules
    const data = await strapi.service("api::classroom.classroom").find({
      filters,
      pagination,
      sort,
      populate: {
        teacher: {
          populate: {
            user: {
              fields: ["email", "name", "gender", "birthday"],
            },
          },
        },
        studentSchedules: {
          count: true,
        },
      },
    });

    data.results = data.results.map((classroom) => {
      const { studentSchedules } = classroom;
      const studentCount = studentSchedules?.count || 0;
      delete classroom.studentSchedules;
      const user = classroom.teacher.user;
      delete classroom.teacher.user;

      return {
        ...classroom,
        studentCount,
        teacher: {
          ...user,
          ...classroom.teacher,
        },
      };
    });

    return data;
  },
};
