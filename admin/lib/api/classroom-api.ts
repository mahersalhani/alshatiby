'use client';

import { Program, Supervisor, Teacher } from '../schemas/classroom';

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
  {
    id: '9',
    name: 'Psychology & Behavioral Studies Program',
    description: 'Human psychology and behavioral analysis curriculum',
    duration: '3 years',
    level: 'Advanced',
  },
  {
    id: '10',
    name: 'Engineering & Technology Program',
    description: 'Mechanical, electrical, and software engineering fundamentals',
    duration: '4 years',
    level: 'Advanced',
  },
  {
    id: '11',
    name: 'Medical & Health Sciences Program',
    description: 'Healthcare, anatomy, and medical research curriculum',
    duration: '5 years',
    level: 'Advanced',
  },
  {
    id: '12',
    name: 'Physical Education & Sports Program',
    description: 'Sports science, fitness, and athletic training',
    duration: '2 years',
    level: 'All Levels',
  },
  {
    id: '13',
    name: 'Music & Performing Arts Program',
    description: 'Musical instruments, vocal training, and performance arts',
    duration: '3 years',
    level: 'All Levels',
  },
  {
    id: '14',
    name: 'Culinary Arts Program',
    description: 'Professional cooking, baking, and restaurant management',
    duration: '2 years',
    level: 'Beginner',
  },
  {
    id: '15',
    name: 'Digital Media & Communications Program',
    description: 'Digital marketing, journalism, and media production',
    duration: '3 years',
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
  {
    id: '11',
    name: 'Dr. Jennifer Lee',
    email: 'jennifer.lee@school.com',
    specialization: 'Engineering & Technology',
    experience: 20,
  },
  {
    id: '12',
    name: 'Ms. Rachel Green',
    email: 'rachel.green@school.com',
    specialization: 'Medical Sciences',
    experience: 17,
  },
  {
    id: '13',
    name: 'Mr. Kevin Brown',
    email: 'kevin.brown@school.com',
    specialization: 'Physical Education',
    experience: 7,
  },
  {
    id: '14',
    name: 'Chef Isabella Romano',
    email: 'isabella.romano@school.com',
    specialization: 'Culinary Arts',
    experience: 22,
  },
  {
    id: '15',
    name: 'Ms. Sophie Turner',
    email: 'sophie.turner@school.com',
    specialization: 'Digital Media',
    experience: 6,
  },
  {
    id: '16',
    name: 'Dr. Alexander Petrov',
    email: 'alexander.petrov@school.com',
    specialization: 'Advanced Mathematics',
    experience: 25,
  },
  {
    id: '17',
    name: 'Prof. Yuki Tanaka',
    email: 'yuki.tanaka@school.com',
    specialization: 'Quantum Physics',
    experience: 19,
  },
  {
    id: '18',
    name: 'Ms. Fatima Al-Zahra',
    email: 'fatima.alzahra@school.com',
    specialization: 'Arabic Literature',
    experience: 14,
  },
  {
    id: '19',
    name: 'Dr. Hans Mueller',
    email: 'hans.mueller@school.com',
    specialization: 'Chemical Engineering',
    experience: 21,
  },
  {
    id: '20',
    name: 'Prof. Priya Sharma',
    email: 'priya.sharma@school.com',
    specialization: 'Data Science',
    experience: 12,
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

// Pagination interface
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Search and pagination for programs
export async function searchPrograms(query = '', page = 1, limit = 10): Promise<PaginatedResponse<Program>> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Filter programs based on search query
  const filteredPrograms = DEMO_PROGRAMS.filter(
    (program) =>
      program.name.toLowerCase().includes(query.toLowerCase()) ||
      program.description?.toLowerCase().includes(query.toLowerCase()) ||
      program.level?.toLowerCase().includes(query.toLowerCase())
  );

  // Calculate pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = filteredPrograms.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    total: filteredPrograms.length,
    page,
    limit,
    hasMore: endIndex < filteredPrograms.length,
  };
}

// Search and pagination for teachers
export async function searchTeachers(query = '', page = 1, limit = 10): Promise<PaginatedResponse<Teacher>> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  // Filter teachers based on search query
  const filteredTeachers = DEMO_TEACHERS.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(query.toLowerCase()) ||
      teacher.email.toLowerCase().includes(query.toLowerCase()) ||
      teacher.specialization?.toLowerCase().includes(query.toLowerCase())
  );

  // Calculate pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = filteredTeachers.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    total: filteredTeachers.length,
    page,
    limit,
    hasMore: endIndex < filteredTeachers.length,
  };
}

// Search and pagination for supervisors
export async function searchSupervisors(query = '', page = 1, limit = 10): Promise<PaginatedResponse<Supervisor>> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 700));

  // Filter supervisors based on search query
  const filteredSupervisors = DEMO_SUPERVISORS.filter(
    (supervisor) =>
      supervisor.name.toLowerCase().includes(query.toLowerCase()) ||
      supervisor.email.toLowerCase().includes(query.toLowerCase()) ||
      supervisor.department?.toLowerCase().includes(query.toLowerCase()) ||
      supervisor.role.toLowerCase().includes(query.toLowerCase())
  );

  // Calculate pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = filteredSupervisors.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    total: filteredSupervisors.length,
    page,
    limit,
    hasMore: endIndex < filteredSupervisors.length,
  };
}

// Keep the original functions for supervisors (they use multi-select)
export async function fetchSupervisors(): Promise<Supervisor[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return DEMO_SUPERVISORS;
}

// Additional utility functions
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
