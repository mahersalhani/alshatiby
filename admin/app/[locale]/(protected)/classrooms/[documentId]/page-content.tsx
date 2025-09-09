'use client';

import { useQuery } from '@tanstack/react-query';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import qs from 'qs';

import { LoadingOverlay } from '@/components/loading-overlay';
import { ClassroomForm } from '@/components/partials/classroom/classroom-form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/axios';

interface EditClassroomProps {
  documentId: string;
}

// Classroom query function
const fetchClassroom = async (documentId: string) => {
  const query = {
    populate: [
      'program',
      'supervisors',
      'teacher',
      'schedules',
      'studentSchedules',
      'studentSchedules.student',
      'studentSchedules.program',
    ],
  };

  const queryString = qs.stringify(query, { encodeValuesOnly: true, addQueryPrefix: true });

  const classroom = await api.get(`/dashboard/classroom/${documentId}${queryString}`).then((res) => res?.data);
  return classroom;
};

export default function EditClassroomPage({ documentId }: EditClassroomProps) {
  const t = useTranslations('ClassroomForm');

  const {
    data: classroom,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['classroom', documentId],
    queryFn: () => fetchClassroom(documentId),
    enabled: !!documentId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Card className="w-full max-w-4xl mx-auto relative">
          <LoadingOverlay isLoading={true} message={t('loadingClassroom')} />
          <CardHeader>
            <CardTitle>{t('updateClassroom')}</CardTitle>
            <CardDescription>{t('updateClassroomDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="container mx-auto py-8">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-6 w-6" />
              {t('errorLoadingClassroom')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert color="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error instanceof Error ? error.message : t('unknownError')}</AlertDescription>
            </Alert>
            <div className="mt-4 flex gap-2">
              <Button onClick={() => refetch()} disabled={isRefetching} variant="outline">
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
                {isRefetching ? t('retrying') : t('retry')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  if (!classroom) {
    return (
      <div className="container mx-auto py-8">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>{t('classroomNotFound')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{t('classroomNotFoundDescription')}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  const user = classroom?.user || {};

  return (
    <div className="container mx-auto py-8">
      <ClassroomForm
        mode="update"
        initialData={{
          ...user,
          ...classroom,
        }}
        queryKey={['classroom', documentId]}
      />
    </div>
  );
}
