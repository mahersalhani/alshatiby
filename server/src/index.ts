import { Core } from "@strapi/strapi";

const setDefaultPermissions = async (strapi: Core.Strapi) => {
  const authenticatedRole = await strapi.db
    .query("plugin::users-permissions.role")
    .findOne({ where: { type: "authenticated" } });

  if (!authenticatedRole) {
    throw new Error("Authenticated role not found");
  }

  const roleId = authenticatedRole.id;

  const contentTypes = ["employee", "program", "student"];

  const newPermissions: {
    [key: string]: {
      controllers: {
        [key: string]: {
          [action: string]: {
            enabled: boolean;
            policy: string;
          };
        };
      };
    };
  } = {};

  for (const ct of contentTypes) {
    const controllers = strapi.api(ct)?.controllers;

    if (!controllers) continue;

    const nestedControllers = Object.keys(controllers).reduce(
      (acc, controllerName) => {
        const actions = Object.keys(controllers[controllerName]);

        acc[controllerName] = actions.reduce((actionAcc, action) => {
          actionAcc[action] = { enabled: true, policy: "" };
          return actionAcc;
        }, {});
        return acc;
      },
      {}
    );

    newPermissions[`api::${ct}`] = {
      controllers: nestedControllers,
    };
  }

  newPermissions["plugin::users-permissions"] = {
    controllers: {
      user: {
        create: { enabled: true, policy: "" },
        update: { enabled: true, policy: "" },
        find: { enabled: true, policy: "" },
        findOne: { enabled: true, policy: "" },
        count: { enabled: true, policy: "" },
        destroy: { enabled: true, policy: "" },
        me: { enabled: true, policy: "" },
      },
      role: {
        createRole: { enabled: true, policy: "" },
        findOne: { enabled: true, policy: "" },
        find: { enabled: true, policy: "" },
        updateRole: { enabled: true, policy: "" },
        deleteRole: { enabled: true, policy: "" },
      },
      permissions: {
        getPermissions: { enabled: true, policy: "" },
      },
    },
  };

  // Update the permissions using the role service
  await strapi.plugin("users-permissions").service("role").updateRole(roleId, {
    permissions: newPermissions,
  });

  strapi.log.info("✅ Dynamic permissions set for authenticated role.");
};

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    try {
      await setDefaultPermissions(strapi);
    } catch (err) {
      strapi.log.error("❌ Failed to set dynamic permissions:", err);
    }
  },
};
