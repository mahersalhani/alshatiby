"use client";

import { useTranslations } from 'next-intl';
import { z } from 'zod';

export function useProgramSchemas() {
	const t = useTranslations('Validation');

	const programCreateSchema = z.object({
		name: z.string().min(2, t('nameMinLength')),
		isActive: z.boolean().default(true),
		supervisorIds: z
			.array(z.string())
			.default([])
			.or(z.array(z.number()).default([])),
	});

	const programUpdateSchema = programCreateSchema;

	return {
		programCreateSchema,
		programUpdateSchema,
	};
}

export type ProgramCreateData = z.infer<ReturnType<typeof useProgramSchemas>['programCreateSchema']>;
export type ProgramUpdateData = z.infer<ReturnType<typeof useProgramSchemas>['programUpdateSchema']>;

export type Supervisor = {
	id: string | number;
	documentId?: string;
	role: string;
	name?: string;
	email?: string;
	gender?: string;
	birthday?: string;
	phoneNumber?: string;
}

export type ProgramData = ProgramCreateData & {
	id?: string | number;
	documentId?: string;
	supervisors?: Supervisor[];
};
