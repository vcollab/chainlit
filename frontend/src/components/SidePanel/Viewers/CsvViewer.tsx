import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useMemo } from 'react';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

import TextViewer from './TextViewer';

function parseCsv(text: string): {
  columns: string[];
  rows: Record<string, string>[];
} {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length === 0) return { columns: [], rows: [] };

  const columns = lines[0]
    .split(',')
    .map((c) => c.trim().replace(/^"|"$/g, ''));
  const rows = lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
    const row: Record<string, string> = {};
    columns.forEach((col, i) => {
      row[col] = values[i] ?? '';
    });
    return row;
  });

  return { columns, rows };
}

function CsvTable({
  columns,
  rows
}: {
  columns: string[];
  rows: Record<string, string>[];
}) {
  const tableColumns: ColumnDef<Record<string, string>>[] = useMemo(
    () =>
      columns.map((col) => ({
        accessorKey: col,
        header: ({ column }) => {
          const sort = column.getIsSorted();
          return (
            <div
              className="flex items-center cursor-pointer"
              onClick={() => column.toggleSorting()}
            >
              {col}
              {sort === 'asc' && <ArrowUp className="ml-1 size-3" />}
              {sort === 'desc' && <ArrowDown className="ml-1 size-3" />}
            </div>
          );
        }
      })),
    [columns]
  );

  const table = useReactTable({
    data: rows,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize: 10 } }
  });

  const currentPage = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();

  const paginationItems = useMemo(() => {
    const items: (number | 'ellipsis')[] = [];
    if (pageCount <= 7) {
      for (let i = 0; i < pageCount; i++) items.push(i);
    } else {
      items.push(0);
      if (currentPage > 3) items.push('ellipsis');
      for (
        let i = Math.max(1, currentPage - 1);
        i <= Math.min(pageCount - 2, currentPage + 1);
        i++
      ) {
        items.push(i);
      }
      if (currentPage < pageCount - 4) items.push('ellipsis');
      items.push(pageCount - 1);
    }
    return items;
  }, [currentPage, pageCount]);

  return (
    <div className="flex flex-col gap-2 h-full overflow-y-auto">
      {/* <div className="text-xs text-muted-foreground px-1">
        {rows.length} rows × {columns.length} columns
      </div> */}
      <div className="rounded-md border overflow-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-xs whitespace-nowrap"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-xs">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-xs"
                >
                  No data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {table.getPageCount() > 1 && (
        <Pagination>
          <PaginationContent className="flex-wrap gap-y-1 justify-center">
            <PaginationItem>
              <PaginationPrevious
                onClick={() => table.previousPage()}
                className={
                  !table.getCanPreviousPage()
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer'
                }
              />
            </PaginationItem>
            {paginationItems.map((item, idx) =>
              item === 'ellipsis' ? (
                <PaginationItem key={`ellipsis-${idx}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={item}>
                  <PaginationLink
                    onClick={() => table.setPageIndex(item)}
                    isActive={currentPage === item}
                    className="cursor-pointer"
                  >
                    {item + 1}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <PaginationNext
                onClick={() => table.nextPage()}
                className={
                  !table.getCanNextPage()
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer'
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

export default function CsvViewer({
  viewMode,
  textContent
}: {
  viewMode: 'preview' | 'raw';
  textContent: string | null;
}) {
  if (textContent === null) return null;

  if (viewMode === 'raw') return <TextViewer textContent={textContent} />;

  const { columns, rows } = parseCsv(textContent);
  if (columns.length === 0) return <TextViewer textContent={textContent} />;

  return <CsvTable columns={columns} rows={rows} />;
}
