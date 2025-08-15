'use client';

import { useQuery } from '@tanstack/react-query';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import qs from 'qs';

import { LoadingOverlay } from '@/components/loading-overlay';
import { StudentForm } from '@/components/partials/students/student-form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/axios';

interface EditStudentProps {
  documentId: string;
}

// Student query function
const fetchStudent = async (documentId: string) => {
  const query = {
    populate: {
      user: {
        fields: ['email', 'name', 'nationality', 'residenceCountry', 'gender', 'birthday', 'phoneNumber', 'joinedAt'],
      },
      payments: {
        sort: ['createdAt:desc'],
      },
    },
  };

  const queryString = qs.stringify(query, { encodeValuesOnly: true, addQueryPrefix: true });
  const response = await api.get(`/dashboard/student/${documentId}${queryString}`);
  return response.data;
};

export default function EditStudentPage({ documentId }: EditStudentProps) {
  const t = useTranslations('StudentForm');

  const {
    data: student,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['student', documentId],
    queryFn: () => fetchStudent(documentId),
    enabled: !!documentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Card className="w-full max-w-4xl mx-auto relative">
          <LoadingOverlay isLoading={true} message={t('loadingStudent')} />
          <CardHeader>
            <CardTitle>{t('updateStudent')}</CardTitle>
            <CardDescription>{t('updateStudentDescription')}</CardDescription>
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
              {t('errorLoadingStudent')}
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
  if (!student) {
    return (
      <div className="container mx-auto py-8">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>{t('studentNotFound')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{t('studentNotFoundDescription')}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  const user = student?.user || {};

  return (
    <div className="container mx-auto py-8">
      <StudentForm
        mode="update"
        initialData={{
          ...user,
          ...student,
        }}
        queryKey={['student', documentId]}
      />
    </div>
  );
}
