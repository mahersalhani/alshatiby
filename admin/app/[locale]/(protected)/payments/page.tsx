import { PaymentDataTable } from './_components/data-table';

import SiteBreadcrumb from '@/components/site-breadcrumb';
import { Card, CardContent } from '@/components/ui/card';

export default function PaymentsPage() {
  return (
    <div>
      <SiteBreadcrumb />
      <div className="space-y-6">
        <Card>
          <CardContent className="p-0">
            <PaymentDataTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
