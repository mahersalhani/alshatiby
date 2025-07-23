import ExampleOne from './_components/data-table';

import SiteBreadcrumb from '@/components/site-breadcrumb';
import { Card, CardContent } from '@/components/ui/card';

const page = () => {
  return (
    <div>
      <SiteBreadcrumb />
      <div className="space-y-6">
        <Card>
          <CardContent className="p-0">
            <ExampleOne />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
