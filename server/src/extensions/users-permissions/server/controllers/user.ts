import { Core } from "@strapi/strapi";
import _ from "lodash";

declare const strapi: Core.Strapi;

export default {
  async me(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized();
    }

    const freshUser = await strapi.entityService.findOne(
      "plugin::users-permissions.user",
      user.id,
      {
        populate: ["employee"],
      }
    );

    const schema = strapi.getModel("plugin::users-permissions.user");

    const sanitizedUser = await strapi.contentAPI.sanitize.output(
      freshUser,
      schema,
      { auth: ctx.state.auth }
    );

    // @ts-ignore
    sanitizedUser.employee = _.pick(freshUser.employee, [
      "id",
      "firstName",
      "lastName",
      "role",
      "phoneNumber",
    ]);

    ctx.body = sanitizedUser;
  },
};
