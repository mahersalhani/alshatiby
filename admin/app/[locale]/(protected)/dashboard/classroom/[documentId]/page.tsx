// import api from '@/lib/axios';
import { notFound } from 'next/navigation';

import { Classroom, ClassroomDetails } from './_components/classroom-details';

import api from '@/lib/axios';

const page = async (props: {
  params: Promise<{ locale: string; documentId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] }>;
}) => {
  const awaitedParams = await props.params;
  const awaitedSearchParams = await props.searchParams;
  const { documentId, locale } = awaitedParams;
  const { schedule } = awaitedSearchParams;

  const res = await api.get(`/dashboard/teacher-classroom/${documentId}`);

  const classroom: Classroom = res.data;

  if (!classroom) {
    notFound();
  }

  return <ClassroomDetails classroom={classroom} locale={locale} schedule={schedule as string} />;
};

export default page;
