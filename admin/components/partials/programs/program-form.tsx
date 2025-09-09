"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2, School, UserCheck } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import qs from 'qs';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { AsyncMultiSelectComponent } from '@/components/async-multi-select';
import { LoadingOverlay } from '@/components/loading-overlay';
import { useRouter } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import api from '@/lib/axios';
import { EmployeeRoleEnum } from '@/lib/schemas/employee';
import { useProgramSchemas, type ProgramCreateData, type ProgramData, type ProgramUpdateData } from '@/lib/schemas/program';

interface ProgramFormProps {
	mode: 'create' | 'update';
	initialData?: Partial<ProgramData>;
}

export function ProgramForm({ mode, initialData }: ProgramFormProps) {
	const scopT = useTranslations();
	const t = useTranslations('ProgramForm');
	const locale = useLocale();
	const { programCreateSchema, programUpdateSchema } = useProgramSchemas();
	const router = useRouter();
	const schema = mode === 'create' ? programCreateSchema : programUpdateSchema;

	const form = useForm<ProgramCreateData | ProgramUpdateData>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: initialData?.name ?? '',
			isActive: initialData?.isActive ?? true,
			supervisorIds: initialData?.supervisors?.map((supervisor) => supervisor.id as string) ?? [],
		},
	});

	const loadSupervisorOptions = async (inputValue: string, page: number) => {
		const reqQuery: any = {};
		reqQuery.pagination = { page, pageSize: 10 };
		reqQuery.filters = {
			role: { $eq: EmployeeRoleEnum.Enum.PROGRAMS_SUPERVISOR },
		};
		if (inputValue) {
			reqQuery.filters = {
				...reqQuery.filters,
				user: {
					$or: [
						{ name: { $containsi: inputValue } },
						{ phoneNumber: { $containsi: inputValue } },
						{ email: { $containsi: inputValue } },
					],
				},
			};
		}
		const queryString = qs.stringify(reqQuery, { skipNulls: true });
		const { data } = await api.get(`/dashboard/employee?${queryString}`);
		const options = data.results.map((employee: any) => ({
			value: employee.id,
			label: employee?.name || employee?.email || 'Unknown',
			data: employee,
		}));
		return { options, hasMore: data.pagination?.pageCount !== page };
	};

	const formatSupervisorOption = (option: any) => (
		<div className="py-1">
			<div className="font-medium">{option.data?.name}</div>
			<div className="text-sm ">{option.data?.email}</div>
		</div>
	);
	const formatSelectedSupervisor = (option: any) => (
		<div>
			<div className="font-medium text-xs">{option.data.name}</div>
			<div className="text-xs text-muted-foreground">{scopT(`Form.${option.data?.role?.toLowerCase()}`)}</div>
		</div>
	);

	const isRTL = locale === 'ar';
	const isEdit = mode === 'update';

	const { mutate, isPending } = useMutation({
		mutationFn: (data: ProgramCreateData | ProgramUpdateData) => {
			const { supervisorIds, ...rest } = data;
			const payload = {
				...rest,
				supervisors: supervisorIds,
			};

			return isEdit
				? api.put(`/dashboard/program/${initialData!.documentId}`, payload)
				: api.post('/dashboard/program', payload);
		},
		onSuccess: (data) => {
			if (isEdit) {
				return toast.success(t('program_updated_successfully'));
			}

			toast.success(t('program_created_successfully'));
			router.push(`/programs/${data.data.documentId}`);
		},
		onError: (err: any) => {
			toast.error(scopT(err.response?.data?.error?.message) ?? err.message);
		},
	});

	return (
		<Card className="w-full max-w-3xl mx-auto relative">
			<LoadingOverlay isLoading={isPending} message={mode === 'create' ? t('creating') : t('updating')} />
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<School className="h-6 w-6" />
					{mode === 'create' ? t('createProgram') : t('updateProgram')}
				</CardTitle>
				<CardDescription>
					{mode === 'create' ? t('createProgramDescription') : t('updateProgramDescription')}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit((data) => mutate(data))} className="space-y-6">
						<div className="space-y-4">
							<h3 className="text-lg font-medium flex items-center gap-2">{t('basicInformation')}</h3>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t('programName')}</FormLabel>
										<FormControl>
											<Input size={"large"} placeholder={t('enterProgramName')} {...field} className={isRTL ? 'text-right' : ''} disabled={isPending} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="isActive"
								render={({ field }) => (
									<FormItem className="flex items-center justify-between rounded-lg border p-3">
										<div className="space-y-0.5">
											<FormLabel>{t('isActive')}</FormLabel>
										</div>
										<FormControl>
											<Switch checked={field.value as boolean} onCheckedChange={field.onChange} disabled={isPending} />
										</FormControl>
									</FormItem>
								)}
							/>
						</div>

						<Separator />

						<div className="space-y-4">
							<h3 className="text-lg font-medium flex items-center gap-2">
								<UserCheck className="h-5 w-5" />
								{t('supervisionInformation')}
							</h3>
							<FormField
								control={form.control}
								name="supervisorIds"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t('supervisors')}</FormLabel>
										<FormControl>
											<AsyncMultiSelectComponent
												loadOptions={loadSupervisorOptions}
												value={field.value as any}
												onChange={field.onChange}
												placeholder={t('selectSupervisors')}
												isDisabled={isPending}
												formatOptionLabel={formatSupervisorOption}
												formatSelectedLabel={formatSelectedSupervisor}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className={`flex justify-end space-x-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
							<Button type="button" variant="outline" disabled={isPending}>
								{t('cancel')}
							</Button>
							<Button type="submit" disabled={isPending}>
								{isPending ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										{mode === 'create' ? t('creating') : t('updating')}
									</>
								) : mode === 'create' ? (
									t('createProgramButton')
								) : (
									t('updateProgramButton')
								)}
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
} 
