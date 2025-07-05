/**
 * student router
 */

export default {
  routes: [
    {
      method: "POST",
      path: "/admin/student",
      handler: "student.create",
    },
  ],
};
