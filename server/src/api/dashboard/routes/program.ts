/**
 * program router
 */

export default {
  routes: [
    {
      method: "GET",
      path: "/dashboard/program",
      handler: "program.find",
    },
    {
      method: "GET",
      path: "/dashboard/program/:id",
      handler: "program.findOne",
    },
    {
      method: "POST",
      path: "/dashboard/program",
      handler: "program.create",
    },
    {
      method: "PUT",
      path: "/dashboard/program/:id",
      handler: "program.update",
    },
  ],
};
