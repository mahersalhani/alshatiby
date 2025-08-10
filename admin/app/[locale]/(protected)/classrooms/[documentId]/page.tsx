import { ClassroomForm } from '@/components/partials/classroom/classroom-form';

interface EditEmployeeProps {
  params: Promise<{ documentId: string }>;
}
const editEmployeePage = async ({ params }: EditEmployeeProps) => {
  // const query = {
  //   populate: {
  //     user: {
  //       fields: ['email', 'name', 'nationality', 'residenceCountry', 'gender', 'birthday', 'phoneNumber', 'joinedAt'],
  //     },
  //   },
  // };

  // const queryString = qs.stringify(query, { encodeValuesOnly: true, addQueryPrefix: true });

  // const { documentId } = await params;
  // const employee = await api.get(`/dashboard/employee/${documentId}${queryString}`).then((res) => res?.data);
  // const user = employee?.user || {};

  return (
    <ClassroomForm
      mode="update"
      // initialData={{
      //   ...user,
      //   ...employee,
      // }}
    />
  );
};

export default editEmployeePage;
