import EditStudentPage from './page-content';

interface EditStudentProps {
  params: Promise<{ documentId: string }>;
}
const editStudentPage = async ({ params }: EditStudentProps) => {
  const { documentId } = await params;

  return <EditStudentPage documentId={documentId} />;
};

export default editStudentPage;
