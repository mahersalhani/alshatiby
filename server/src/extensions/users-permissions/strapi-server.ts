"use strict";

import userController from "./server/controllers/user";

export default (plugin) => {
  plugin.controllers.user = {
    ...plugin.controllers.user,
    ...userController,
  };

  return plugin;
};
