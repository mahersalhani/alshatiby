import ExampleOne from './_components/example1';

import SiteBreadcrumb from '@/components/site-breadcrumb';
import { Card, CardContent } from '@/components/ui/card';
// {
//     "results": [
//         {
//             "id": 9,
//             "documentId": "zb1qaxwlgrwwfdounyyv0dgk",
//             "firstName": "ماهر",
//             "createdAt": "2025-07-01T22:49:53.825Z",
//             "updatedAt": "2025-07-01T22:49:53.825Z",
//             "publishedAt": "2025-07-01T22:49:53.822Z",
//             "locale": null,
//             "lastName": "صالحاني",
//             "role": "TEACHER",
//             "phoneNumber": ""
//         },
//         {
//             "id": 10,
//             "documentId": "u6udva2z90xp9dyx5fst3jom",
//             "firstName": "ماهر",
//             "createdAt": "2025-07-01T23:45:48.911Z",
//             "updatedAt": "2025-07-01T23:45:48.911Z",
//             "publishedAt": "2025-07-01T23:45:48.905Z",
//             "locale": null,
//             "lastName": "صالحاني",
//             "role": "SUPERVISOR",
//             "phoneNumber": "05380788021"
//         },
//         {
//             "id": 11,
//             "documentId": "mqp1mugtd3qianxp6fpuogns",
//             "firstName": "غيث",
//             "createdAt": "2025-07-12T14:57:18.360Z",
//             "updatedAt": "2025-07-12T14:57:18.360Z",
//             "publishedAt": "2025-07-12T14:57:18.356Z",
//             "locale": null,
//             "lastName": "صالحاني",
//             "role": "SUPERVISOR",
//             "phoneNumber": "011111111"
//         },
//         {
//             "id": 12,
//             "documentId": "bwygqfbu9zb37ewybkz2ahzp",
//             "firstName": "غيث",
//             "createdAt": "2025-07-12T14:57:28.072Z",
//             "updatedAt": "2025-07-12T14:57:28.072Z",
//             "publishedAt": "2025-07-12T14:57:28.069Z",
//             "locale": null,
//             "lastName": "صالحاني",
//             "role": "SUPERVISOR",
//             "phoneNumber": "011111111"
//         },
//         {
//             "id": 13,
//             "documentId": "iyr6vs80idwe2nkk2v0zctn7",
//             "firstName": "غيث",
//             "createdAt": "2025-07-12T14:58:31.501Z",
//             "updatedAt": "2025-07-12T14:58:31.501Z",
//             "publishedAt": "2025-07-12T14:58:31.498Z",
//             "locale": null,
//             "lastName": "صالحاني",
//             "role": "SUPERVISOR",
//             "phoneNumber": "011111111"
//         }
//     ],
//     "pagination": {
//         "page": 1,
//         "pageSize": 5,
//         "pageCount": 2,
//         "total": 6
//     }
// }
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
