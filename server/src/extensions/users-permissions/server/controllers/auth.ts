import { Core } from "@strapi/strapi";

const _ = require("lodash");
const { contentTypes: contentTypesUtils } = require("@strapi/utils");
const { ApplicationError } = require("@strapi/utils").errors;

declare const strapi: Core.Strapi;

const { UPDATED_BY_ATTRIBUTE, CREATED_BY_ATTRIBUTE } =
  contentTypesUtils.constants;

const userModel = "plugin::users-permissions.user";
const ACTIONS = {
  read: "plugin::content-manager.explorer.read",
  create: "plugin::content-manager.explorer.create",
  edit: "plugin::content-manager.explorer.update",
  delete: "plugin::content-manager.explorer.delete",
};

export default {
  async create(ctx) {
    const { body } = ctx.request;
    const { user: admin, userAbility } = ctx.state;

    const { email } = body;

    const pm = strapi.service("admin::permission").createPermissionsManager({
      ability: userAbility,
      action: ACTIONS.create,
      model: userModel,
    });

    if (!pm.isAllowed) {
      return ctx.forbidden();
    }

    const sanitizedBody = await pm.pickPermittedFieldsOf(body, {
      subject: userModel,
    });

    const advanced: any = await strapi
      .store({ type: "plugin", name: "users-permissions", key: "advanced" })
      .get();

    // check email and password are provided
    if (!sanitizedBody.email || !sanitizedBody.password) {
      return ctx.badRequest("Email and password are required");
    }

    if (advanced.unique_email) {
      const userWithSameEmail = await strapi.db
        .query("plugin::users-permissions.user")
        .findOne({ where: { email: email.toLowerCase() } });

      if (userWithSameEmail) {
        throw new ApplicationError("Email already taken");
      }
    }

    const user = {
      ...sanitizedBody,
      provider: "local",
      [CREATED_BY_ATTRIBUTE]: admin.id,
      [UPDATED_BY_ATTRIBUTE]: admin.id,
    };

    user.email = _.toLower(user.email);

    try {
      const data = await strapi
        .service("plugin::content-manager.document-manager")
        .create(userModel, { data: user });

      const sanitizedData = await pm.sanitizeOutput(data, {
        action: ACTIONS.read,
      });

      ctx.created(sanitizedData);
    } catch (error) {
      throw new ApplicationError(error.message);
    }
  },
};
