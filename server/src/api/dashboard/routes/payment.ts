/**
 * classroom router
 */

export default {
  routes: [
    {
      method: "POST",
      path: "/dashboard/student-payments",
      handler: "payment.createStudentPayment",
    },
    {
      method: "GET",
      path: "/dashboard/student-payments",
      handler: "payment.findStudentPayments",
    },
    {
      method: "PUT",
      path: "/dashboard/student-payments/:id",
      handler: "payment.updateStudentPayment",
    },
    {
      method: "DELETE",
      path: "/dashboard/student-payments/:id",
      handler: "payment.deleteStudentPayment",
    },
  ],
};
