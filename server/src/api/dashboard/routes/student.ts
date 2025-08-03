/**
 * student router
 */

export default {
  routes: [
    {
      method: "POST",
      path: "/dashboard/student",
      handler: "student.create",
    },
    {
      method: "GET",
      path: "/dashboard/student",
      handler: "student.find",
    },
    {
      method: "GET",
      path: "/dashboard/student/:id",
      handler: "student.findOne",
    },
    {
      method: "PUT",
      path: "/dashboard/student/:id/password",
      handler: "student.updateStudentPassword",
    },
    {
      method: "PUT",
      path: "/dashboard/student/:id",
      handler: "student.update",
    },
    // {
    //   method: "DELETE",
    //   path: "/dashboard/student/:id",
    //   handler: "student.delete",
    // },
  ],
};
