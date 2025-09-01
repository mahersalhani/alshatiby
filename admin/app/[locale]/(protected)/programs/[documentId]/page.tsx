import { ProgramForm } from '@/components/partials/programs/program-form';
import api from '@/lib/axios';

export default async function EditProgramPage({ params }: { params: Promise<{ documentId: string }> }) {
	const _params = await params;

	const initialData = await api.get(`/dashboard/program/${_params.documentId}`);

	return <ProgramForm mode="update" initialData={initialData.data} />;
};
