// app/[locale]/students/create/page.tsx
import StudentForm from '@/components/partials/students/student-form'; // تأكد من المسار الصحيح

const CreateStudentPage = () => {
  return <StudentForm />;
};

export default CreateStudentPage;

// إذا كنت تريد إضافة metadata لهذه الصفحة (عنوان الصفحة في المتصفح)
export const metadata = {
  title: 'Add New Student', // يمكن ترجمة هذا العنوان باستخدام next-intl في layout.tsx أو metadata API
};