import { redirect } from '@/components/navigation';

const page = async ({ params }: { params: Promise<{ locale: string }> }) => {
  return redirect({
    href: `/dashboard`,
    locale: (await params).locale,
  });
};

export default page;
