import { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TablePagination({ table }: { table: Table<any> }) {
  return (
    <div className="flex items-center justify-end py-4 px-10">
      <div className="flex items-center gap-2 flex-none">
        <Button
          variant="outline"
          size="icon"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="w-8 h-8"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        {table.getPageOptions().map((page, pageIndex) => (
          <Button
            key={`basic-data-table-${pageIndex}`}
            onClick={() => table.setPageIndex(pageIndex)}
            size="icon"
            className="w-8 h-8"
            variant={table.getState().pagination.pageIndex === pageIndex ? 'default' : 'outline'}
          >
            {page + 1}
          </Button>
        ))}
        <Button
          variant="outline"
          size="icon"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="w-8 h-8"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
