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
      groupLabel: t('dashboard'),
      id: 'dashboard',
      menus: [
        {
          id: 'dashboard',
          href: '/',
          label: t('dashboard'),
          active: pathname === '/dashboard' || pathname === '/',
          icon: 'heroicons-outline:home',
          submenus: [],
        },
        {
          id: 'students',
          href: '/students',
          label: t('students'),
          active: pathname.includes('/students'),
          icon: 'heroicons-outline:academic-cap',
          submenus: [
            {
              icon: 'heroicons-outline:academic-cap',
              href: '/students',
              label: t('student_list'),
              active: pathname === '/students',
              children: [],
            },
            {
              icon: 'heroicons-outline:academic-cap',
              href: '/students/create',
              label: t('create_student'),
              active: pathname === '/students/create',
              children: [],
            },
          ],
        },
        {
          id: 'employees',
          href: '/employees',
          label: t('employees'),
          active: pathname.includes('/employees'),
          icon: 'heroicons-outline:users',
          submenus: [
            {
              icon: 'heroicons-outline:user-group',
              href: '/employees',
              label: t('employee_list'),
              active: pathname === '/employees',
              children: [],
            },
            {
              icon: 'heroicons-outline:user-group',
              href: '/employees/create',
              label: t('create_employee'),
              active: pathname === '/employees/create',
              children: [],
            },
          ],
        },
      ],
    },
  ];
}
export function getHorizontalMenuList(pathname: string, t: any): Group[] {
  return [
    {
      groupLabel: t('dashboard'),
      id: 'dashboard',
      menus: [
        {
          id: 'dashboard',
          href: '/',
          label: t('dashboard'),
          active: pathname.includes('/'),
          icon: 'heroicons-outline:home',
          submenus: [],
        },
      ],
    },
  ];
}
