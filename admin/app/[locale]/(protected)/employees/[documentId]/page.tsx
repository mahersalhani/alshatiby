import qs from 'qs';

import EmployeeForm from '@/components/partials/employees/employee-form';
import api from '@/lib/axios';

interface EditEmployeeProps {
  params: Promise<{ documentId: string }>;
}
const editEmployeePage = async ({ params }: EditEmployeeProps) => {
  const query = {
    populate: {
      user: {
        fields: ['email'],
      },
    },
  };

  const queryString = qs.stringify(query, { encodeValuesOnly: true, addQueryPrefix: true });

  const { documentId } = await params;
  const employee = await api.get(`/admin/employee/${documentId}${queryString}`).then((res) => res?.data?.data);

  return (
    <EmployeeForm
      isEdit={true}
      employeeData={{
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.user?.email || '',
        phoneNumber: employee.phoneNumber || '',
        role: employee.role,
        documentId: employee.documentId,
      }}
    />
  );
};

export default editEmployeePage;
