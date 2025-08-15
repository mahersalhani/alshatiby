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
  ],
};
