/**
 * program router
 */

export default {
  routes: [
    {
      method: "POST",
      path: "/dashboard/program",
      handler: "program.create",
    },
    {
      method: "GET",
      path: "/dashboard/program",
      handler: "program.find",
    },
  ],
};
