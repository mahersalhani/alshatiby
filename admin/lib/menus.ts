export type SubChildren = {
  href: string;
  label: string;
  active: boolean;
  children?: SubChildren[];
};
export type Submenu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus?: Submenu[];
  children?: SubChildren[];
};

export type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus: Submenu[];
  id: string;
};

export type Group = {
  groupLabel: string;
  menus: Menu[];
  id: string;
};

export function getMenuList(pathname: string, t: any): Group[] {
  return [
    {
      groupLabel: t('Menu.dashboard'),
      id: 'dashboard',
      menus: [
        {
          id: 'dashboard',
          href: '/',
          label: t('Menu.dashboard'),
          active: pathname === '/dashboard' || pathname === '/',
          icon: 'heroicons-outline:home',
          submenus: [],
        },
        {
          id: 'students',
          href: '/students',
          label: t('Menu.students'),
          active: pathname.includes('/students'),
          icon: 'heroicons-outline:academic-cap',
          submenus: [
            {
              icon: 'heroicons-outline:academic-cap',
              href: '/students',
              label: t('Menu.student_list'),
              active: pathname === '/students',
              children: [],
            },
            {
              icon: 'heroicons-outline:academic-cap',
              href: '/students/create',
              label: t('Menu.create_student'),
              active: pathname === '/students/create',
              children: [],
            },
          ],
        },
        {
          id: 'employees',
          href: '/employees',
          label: t('Menu.employees'),
          active: pathname.includes('/employees'),
          icon: 'heroicons-outline:users',
          submenus: [
            {
              icon: 'heroicons-outline:user-group',
              href: '/employees',
              label: t('Menu.employee_list'),
              active: pathname === '/employees',
              children: [],
            },
            {
              icon: 'heroicons-outline:user-group',
              href: '/employees/create',
              label: t('Menu.create_employee'),
              active: pathname === '/employees/create',
              children: [],
            },
          ],
        },
        {
          id: 'classrooms',
          href: '/classrooms',
          label: t('Menu.classrooms'),
          active: pathname.includes('/classrooms'),
          icon: 'heroicons-outline:user-group',
          submenus: [
            {
              icon: 'heroicons-outline:user-group',
              href: '/classrooms',
              label: t('Menu.classroom_list'),
              active: pathname === '/classrooms',
              children: [],
            },
            {
              icon: 'heroicons-outline:user-group',
              href: '/classrooms/create',
              label: t('Menu.create_classroom'),
              active: pathname === '/classrooms/create',
              children: [],
            },
          ],
        },
        {
          id: 'programs',
          href: '/programs',
          label: t('Menu.programs'),
          active: pathname.includes('/programs'),
          icon: 'heroicons-outline:academic-cap',
          submenus: [
            {
              icon: 'heroicons-outline:academic-cap',
              href: '/programs',
              label: t('Menu.program_list'),
              active: pathname === '/programs',
              children: [],
            },
            {
              icon: 'heroicons-outline:academic-cap',
              href: '/programs/create',
              label: t('Menu.create_program'),
              active: pathname === '/programs/create',
              children: [],
            },
          ],
        },
        {
          id: 'payments',
          href: '/payments',
          label: t('Menu.payments'),
          active: pathname.includes('/payments'),
          icon: 'heroicons-outline:credit-card',
          submenus: [
            {
              icon: 'heroicons-outline:credit-card',
              href: '/payments',
              label: t('Menu.payment_list'),
              active: pathname === '/payments',
              children: [],
            },
            {
              icon: 'heroicons-outline:credit-card',
              href: '/payments/create',
              label: t('Menu.create_payment'),
              active: pathname === '/payments/create',
              children: [],
            }
          ],
        }
      ],
    },
  ];
}
