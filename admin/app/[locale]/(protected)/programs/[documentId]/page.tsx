import { ProgramForm } from '@/components/partials/programs/program-form';

interface EditProgramProps {
	params: Promise<{ documentId: string }>;
}
const EditProgramPage = async ({ params }: EditProgramProps) => {
	return <ProgramForm mode="update" />;
};

export default EditProgramPage;
