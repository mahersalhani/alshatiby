import qs from 'qs';

import { StudentForm } from '@/components/partials/students/student-form';
import api from '@/lib/axios';

interface EditStudentProps {
  params: Promise<{ documentId: string }>;
}
const editStudentPage = async ({ params }: EditStudentProps) => {
  const query = {
    populate: {
      user: {
        fields: ['email', 'name', 'nationality', 'residenceCountry', 'gender', 'birthday', 'phoneNumber', 'joinedAt'],
      },
    },
  };

  const queryString = qs.stringify(query, { encodeValuesOnly: true, addQueryPrefix: true });

  const { documentId } = await params;
  const student = await api.get(`/dashboard/student/${documentId}${queryString}`).then((res) => res?.data);
  const user = student?.user || {};

  return (
    <StudentForm
      mode="update"
      initialData={{
        ...user,
        ...student,
      }}
    />
  );
};

export default editStudentPage;
