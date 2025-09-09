import EditClassroomPage from './page-content';

interface EditClassroomProps {
  params: Promise<{ documentId: string }>;
}
const editClassroomPage = async ({ params }: EditClassroomProps) => {
  const { documentId } = await params;

  return <EditClassroomPage documentId={documentId} />;
};

export default editClassroomPage;
