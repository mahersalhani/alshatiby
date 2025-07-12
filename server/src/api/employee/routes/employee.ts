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
  ],
};
