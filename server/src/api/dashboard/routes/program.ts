/**
 * program router
 */

export default {
  routes: [
    // {
    //   method: "POST",
    //   path: "/dashboard/program",
    //   handler: "program.create",
    // },
    {
      method: "GET",
      path: "/dashboard/program",
      handler: "program.find",
    },
    // {
    //   method: "GET",
    //   path: "/dashboard/program/:id",
    //   handler: "program.findOne",
    // },
    // {
    //   method: "PUT",
    //   path: "/dashboard/program/:id/password",
    //   handler: "program.updateProgramPassword",
    // },
    // {
    //   method: "PUT",
    //   path: "/dashboard/program/:id",
    //   handler: "program.update",
    // },
    // {
    //   method: "DELETE",
    //   path: "/dashboard/program/:id",
    //   handler: "program.delete",
    // },
  ],
};
