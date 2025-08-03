import qs from 'qs';

import { EmployeeForm } from '@/components/partials/employees/employee-form';
import api from '@/lib/axios';

interface EditEmployeeProps {
  params: Promise<{ documentId: string }>;
}
const editEmployeePage = async ({ params }: EditEmployeeProps) => {
  const query = {
    populate: {
      user: {
        fields: ['email', 'name', 'nationality', 'residenceCountry', 'gender', 'birthday', 'phoneNumber'],
      },
    },
  };

  const queryString = qs.stringify(query, { encodeValuesOnly: true, addQueryPrefix: true });

  const { documentId } = await params;
  const employee = await api.get(`/dashboard/employee/${documentId}${queryString}`).then((res) => res?.data);
  const user = employee?.user || {};

  return (
    <EmployeeForm
      mode="update"
      initialData={{
        ...user,
        ...employee,
      }}
    />
  );
};

export default editEmployeePage;
