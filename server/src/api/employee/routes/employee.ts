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
  ],
};
