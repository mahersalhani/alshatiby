export type color = 'default' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'destructive';
export type InputColor = 'default' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'destructive';
export type shadow = 'sm' | 'md' | 'lg' | 'xl';
export type size = 'default' | 'sm' | 'md' | 'lg';
export type rounded = 'sm' | 'md' | 'lg' | 'full';
export type radius = 'sm' | 'md' | 'lg' | 'xl' | 'none';

// config
export type layoutType = 'vertical' | 'horizontal' | 'semi-box' | 'compact';
export type contentType = 'wide' | 'boxed';
export type skinType = 'default' | 'bordered';
export type sidebarType = 'classic' | 'draggable' | 'two-column' | 'compact';
export type navBarType = 'floating' | 'sticky' | 'hidden' | 'default';
export type headerColorType = 'default' | 'coloured' | 'transparent';

export type PaginatedResponse<T> = {
  pagination: {
    page: number;
    pageCount: number;
    pageSize: number;
    total: number;
  };
  results: T[];
};


// *********************************
// Temporary types
// *********************************

export type Student = {
  id: string;
  documentId: string;
  role: string;
  name: string;
  phoneNumber: string;
  gender: string;
  user: {
    email: string;
  };
};

export type Employee = {
  id: string;
  documentId: string;
  role: string;
  name: string;
  phoneNumber: string;
  email: string;
};

export type Classroom = {
  id: string;
  documentId: string;
  classroomName: string;
  teacher?: {
    name: string;
  };
  phoneNumber: string;
  studentCount: string;
};

export type Program = {
  id: string;
  documentId: string;
  name: string
};

export type PaymentRecord = {
  id: number;
  documentId: string;
  title?: string | null;
  amount: number;
  currency: 'USD' | 'TRY' | 'EUR' | 'SAR';
  paymentType: 'MONTH_1' | 'MONTH_2' | 'MONTH_3' | 'MONTH_6' | 'YEAR_1';
  startDate: string;
  endDate: string;
  createdAt: string;
  student?: {
    id: number;
    documentId: string;
    name: string;
  };
};
