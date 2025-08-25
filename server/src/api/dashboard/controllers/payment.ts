/**
 * payment controller
 */

import { Core } from "@strapi/strapi";

declare const strapi: Core.Strapi;

export default {
  async createStudentPayment(ctx) {
    const body = ctx.request.body;
    return strapi.entityService.create("api::payment.payment", {
      data: {
        ...body,
      },
    });
  },
  async findStudentPayments(ctx) {
    const { studentId } = ctx.params;
    return strapi.entityService.findMany("api::payment.payment", {
      filters: { student: studentId },
      populate: ["student"],
    });
  },
  async updateStudentPayment(ctx) {
    const { id } = ctx.params;
    const body = ctx.request.body;
    return strapi.documents("api::payment.payment").update({
      documentId: id,
      data: {
        ...body,
      },
    });
  },
  async deleteStudentPayment(ctx) {
    const { id } = ctx.params;
    return strapi.documents("api::payment.payment").delete({
      documentId: id,
    });
  },
};
