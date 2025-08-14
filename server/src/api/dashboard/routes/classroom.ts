/**
 * classroom router
 */

export default {
  routes: [
    {
      method: "GET",
      path: "/dashboard/teacher-classrooms",
      handler: "classroom.findTeacherClassrooms",
    },
    {
      method: "GET",
      path: "/dashboard/teacher-classroom/:classroomId",
      handler: "classroom.findTeacherClassroom",
    },
    {
      method: "POST",
      path: "/dashboard/classroom",
      handler: "classroom.create",
    },
    {
      method: "GET",
      path: "/dashboard/classroom",
      handler: "classroom.find",
    },
  ],
};
