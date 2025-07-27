const isAuthenticated = async (ctx, config, { strapi }) => {
  if (ctx.state.user) {
    return true;
  }

  return ctx.unauthorized("You must be logged in to access this resource.");
};

export default isAuthenticated;
