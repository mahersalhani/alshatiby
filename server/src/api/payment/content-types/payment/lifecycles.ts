import { addDuration } from "../../../../utils/payment";

export default {
  beforeCreate(event) {
    const { data } = event.params;

    const now = data.startDate ? new Date(data.startDate) : new Date();
    if (data.paymentType) {
      data.endDate = addDuration(now, data.paymentType);
    }
  },
  beforeUpdate(event) {
    const { data } = event.params;

    if (data.startDate && data.paymentType) {
      const startDate = new Date(data.startDate);
      data.endDate = addDuration(startDate, data.paymentType);
    }
  },
};
