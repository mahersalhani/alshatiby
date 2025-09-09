/**
 * student-schedule router
 */

export default {
  routes: [
    {
      method: "POST",
      path: "/dashboard/student-schedule",
      handler: "student-schedule.create",
    },
    {
      method: "DELETE",
      path: "/dashboard/student-schedule/:id",
      handler: "student-schedule.delete",
    },
  ],
};
