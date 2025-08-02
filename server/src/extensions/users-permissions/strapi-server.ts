"use strict";

import authController from "./server/controllers/auth";
import userController from "./server/controllers/user";

export default (plugin) => {
  plugin.controllers.user = {
    ...plugin.controllers.user,
    ...userController,
  };

  plugin.controllers.contentmanageruser = {
    ...plugin.controllers.contentmanageruser,
    ...authController,
  };

  return plugin;
};
