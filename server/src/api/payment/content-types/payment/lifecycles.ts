const addDuration = (startDate: Date, paymentType: string): Date => {
  const date = new Date(startDate);
  switch (paymentType) {
    case "MONTH_1":
      date.setMonth(date.getMonth() + 1);
      break;
    case "MONTH_2":
      date.setMonth(date.getMonth() + 2);
      break;
    case "MONTH_3":
      date.setMonth(date.getMonth() + 3);
      break;
    case "MONTH_6":
      date.setMonth(date.getMonth() + 6);
      break;
    case "YEAR_1":
      date.setFullYear(date.getFullYear() + 1);
      break;
    default:
      throw new Error(`Unknown payment type: ${paymentType}`);
  }
  return date;
};

export default {
  beforeCreate(event) {
    const { data } = event.params;

    const now = new Date(); // Assume start is now, or use data.createdAt
    if (data.paymentType) {
      data.endDate = addDuration(now, data.paymentType);
    }
  },
};
