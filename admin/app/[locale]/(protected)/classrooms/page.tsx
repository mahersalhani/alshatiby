import ClassroomDataTable from './_components/data-table';

import SiteBreadcrumb from '@/components/site-breadcrumb';
import { Card, CardContent } from '@/components/ui/card';

const classroomsPage = () => {
  return (
    <div>
      <SiteBreadcrumb />
      <div className="space-y-6">
        <Card>
          <CardContent className="p-0">
            <ClassroomDataTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default classroomsPage;
