/**
 * employee router
 */

export default {
  routes: [
    {
      method: "POST",
      path: "/admin/employee",
      handler: "employee.create",
    },
    {
      method: "GET",
      path: "/admin/employee",
      handler: "employee.find",
    },
    {
      method: "GET",
      path: "/admin/employee/:id",
      handler: "employee.findOne",
    },
    {
      method: "PUT",
      path: "/admin/employee/:id",
      handler: "employee.update",
    },
    {
      method: "DELETE",
      path: "/admin/employee/:id",
      handler: "employee.delete",
    },
  ],
};
