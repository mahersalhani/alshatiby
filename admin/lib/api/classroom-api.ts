'use client';

import type { Program, Supervisor, Teacher } from '@/lib/schemas/classroom';

// Enhanced demo data
const DEMO_PROGRAMS: Program[] = [
  {
    id: '1',
    name: 'Advanced Mathematics Program',
    description: 'Comprehensive mathematics curriculum covering algebra, calculus, and statistics',
    duration: '2 years',
    level: 'Advanced',
  },
  {
    id: '2',
    name: 'Science & Technology Program',
    description: 'Integrated science program with physics, chemistry, and biology',
    duration: '3 years',
    level: 'Intermediate',
  },
  {
    id: '3',
    name: 'Language Arts & Literature Program',
    description: 'English language, literature, and creative writing curriculum',
    duration: '2 years',
    level: 'Beginner',
  },
  {
    id: '4',
    name: 'World History & Social Studies Program',
    description: 'Comprehensive history and social sciences curriculum',
    duration: '2.5 years',
    level: 'Intermediate',
  },
  {
    id: '5',
    name: 'Creative Arts & Design Program',
    description: 'Visual arts, music, and creative design curriculum',
    duration: '3 years',
    level: 'All Levels',
  },
  {
    id: '6',
    name: 'Computer Science & Programming Program',
    description: 'Modern programming languages and computer science fundamentals',
    duration: '4 years',
    level: 'Advanced',
  },
  {
    id: '7',
    name: 'Business & Economics Program',
    description: 'Business administration and economic principles',
    duration: '3 years',
    level: 'Intermediate',
  },
  {
    id: '8',
    name: 'Environmental Science Program',
    description: 'Environmental studies and sustainability curriculum',
    duration: '2 years',
    level: 'Intermediate',
  },
];

const DEMO_TEACHERS: Teacher[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@school.com',
    specialization: 'Mathematics & Statistics',
    experience: 12,
  },
  {
    id: '2',
    name: 'Prof. Michael Chen',
    email: 'michael.chen@school.com',
    specialization: 'Physics & Chemistry',
    experience: 15,
  },
  {
    id: '3',
    name: 'Ms. Emily Rodriguez',
    email: 'emily.rodriguez@school.com',
    specialization: 'English Literature',
    experience: 8,
  },
  {
    id: '4',
    name: 'Mr. David Thompson',
    email: 'david.thompson@school.com',
    specialization: 'World History',
    experience: 10,
  },
  {
    id: '5',
    name: 'Dr. Lisa Anderson',
    email: 'lisa.anderson@school.com',
    specialization: 'Visual Arts',
    experience: 14,
  },
  {
    id: '6',
    name: 'Prof. James Wilson',
    email: 'james.wilson@school.com',
    specialization: 'Computer Science',
    experience: 18,
  },
  {
    id: '7',
    name: 'Dr. Maria Garcia',
    email: 'maria.garcia@school.com',
    specialization: 'Biology & Environmental Science',
    experience: 11,
  },
  {
    id: '8',
    name: 'Mr. Robert Kim',
    email: 'robert.kim@school.com',
    specialization: 'Business Administration',
    experience: 9,
  },
  {
    id: '9',
    name: 'Dr. Amanda White',
    email: 'amanda.white@school.com',
    specialization: 'Psychology & Education',
    experience: 13,
  },
  {
    id: '10',
    name: 'Prof. Carlos Martinez',
    email: 'carlos.martinez@school.com',
    specialization: 'Music & Performing Arts',
    experience: 16,
  },
];

const DEMO_SUPERVISORS: Supervisor[] = [
  {
    id: '1',
    name: 'Dr. Robert Smith',
    email: 'robert.smith@school.com',
    role: 'PROGRAMS_SUPERVISOR',
    department: 'Academic Affairs',
  },
  {
    id: '2',
    name: 'Ms. Jennifer Davis',
    email: 'jennifer.davis@school.com',
    role: 'CLASSROOM_SUPERVISOR',
    department: 'Student Services',
  },
  {
    id: '3',
    name: 'Mr. William Brown',
    email: 'william.brown@school.com',
    role: 'PROGRAMS_SUPERVISOR',
    department: 'Curriculum Development',
  },
  {
    id: '4',
    name: 'Dr. Maria Garcia',
    email: 'maria.garcia.supervisor@school.com',
    role: 'CLASSROOM_SUPERVISOR',
    department: 'Student Affairs',
  },
  {
    id: '5',
    name: 'Prof. Thomas Miller',
    email: 'thomas.miller@school.com',
    role: 'PROGRAMS_SUPERVISOR',
    department: 'Research & Development',
  },
  {
    id: '6',
    name: 'Ms. Patricia Wilson',
    email: 'patricia.wilson@school.com',
    role: 'CLASSROOM_SUPERVISOR',
    department: 'Quality Assurance',
  },
  {
    id: '7',
    name: 'Dr. Christopher Lee',
    email: 'christopher.lee@school.com',
    role: 'PROGRAMS_SUPERVISOR',
    department: 'Innovation & Technology',
  },
  {
    id: '8',
    name: 'Ms. Linda Taylor',
    email: 'linda.taylor@school.com',
    role: 'CLASSROOM_SUPERVISOR',
    department: 'Student Support',
  },
  {
    id: '9',
    name: 'Mr. Kevin Johnson',
    email: 'kevin.johnson@school.com',
    role: 'PROGRAMS_SUPERVISOR',
    department: 'Assessment & Evaluation',
  },
  {
    id: '10',
    name: 'Dr. Susan Anderson',
    email: 'susan.anderson@school.com',
    role: 'CLASSROOM_SUPERVISOR',
    department: 'Learning Resources',
  },
];

// Mock API functions with realistic delays
export async function fetchPrograms(): Promise<Program[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return DEMO_PROGRAMS;
}

export async function fetchTeachers(): Promise<Teacher[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 900));
  return DEMO_TEACHERS;
}

export async function fetchSupervisors(): Promise<Supervisor[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return DEMO_SUPERVISORS;
}

// Additional utility functions for filtering
export async function fetchTeachersBySpecialization(specialization: string): Promise<Teacher[]> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return DEMO_TEACHERS.filter((teacher) =>
    teacher.specialization?.toLowerCase().includes(specialization.toLowerCase())
  );
}

export async function fetchSupervisorsByRole(
  role: 'PROGRAMS_SUPERVISOR' | 'CLASSROOM_SUPERVISOR'
): Promise<Supervisor[]> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return DEMO_SUPERVISORS.filter((supervisor) => supervisor.role === role);
}
