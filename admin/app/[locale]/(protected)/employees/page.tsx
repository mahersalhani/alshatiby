import { EmployeesDataTable } from './_components/data-table';

import SiteBreadcrumb from '@/components/site-breadcrumb';
import { Card, CardContent } from '@/components/ui/card';

export default function EmployeesPage() {
  return (
    <div>
      <SiteBreadcrumb />
      <div className="space-y-6">
        <Card>
          <CardContent className="p-0">
            <EmployeesDataTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
