import qs from 'qs';

import { ClassroomForm } from '@/components/partials/classroom/classroom-form';
import api from '@/lib/axios';

interface EditEmployeeProps {
  params: Promise<{ documentId: string }>;
}
const editEmployeePage = async ({ params }: EditEmployeeProps) => {
  const query = {
    populate: ['program', 'supervisors', 'teacher', 'schedules'],
  };

  const queryString = qs.stringify(query, { encodeValuesOnly: true, addQueryPrefix: true });
  const { documentId } = await params;

  const classroom = await api.get(`/dashboard/classroom/${documentId}${queryString}`).then((res) => res?.data);
  console.log('🚀 ~ editEmployeePage ~ classroom:', classroom);

  return (
    <ClassroomForm
      mode="update"
      initialData={{
        ...classroom,
        programId: classroom?.program?.id,
        teacherId: classroom?.teacher?.id,
        supervisorIds: classroom?.supervisors?.map((s: any) => s.id) || [],
      }}
    />
  );
};

export default editEmployeePage;
