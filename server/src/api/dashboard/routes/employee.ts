/**
 * employee router
 */

export default {
  routes: [
    {
      method: "POST",
      path: "/dashboard/employee",
      handler: "employee.create",
    },
    {
      method: "GET",
      path: "/dashboard/employee",
      handler: "employee.find",
    },
    {
      method: "GET",
      path: "/dashboard/employee/:id",
      handler: "employee.findOne",
    },
    {
      method: "PUT",
      path: "/dashboard/employee/:id/password",
      handler: "employee.updateEmployeePassword",
    },
    {
      method: "PUT",
      path: "/dashboard/employee/:id",
      handler: "employee.update",
    },
    // {
    //   method: "DELETE",
    //   path: "/dashboard/employee/:id",
    //   handler: "employee.delete",
    // },
  ],
};
