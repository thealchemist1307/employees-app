import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";

type Props<TData extends object> = {
  columns: ColumnDef<TData>[];
  data: TData[];
};

export function DataTable<TData extends object>({ columns, data }: Props<TData>) {
  const [{ pageIndex, pageSize }, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    state: { pagination: { pageIndex, pageSize } },
    onPaginationChange: setPagination,
    manualPagination: false,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
      {/* table */}
      <div className="border border-gray-300 rounded-lg overflow-hidden shadow-lg">
        <Table>
          <TableHeader className="bg-slate-700">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => {
                  const sorted = h.column.getIsSorted(); // false | 'asc' | 'desc'
                  return (
                    <TableHead
                      key={h.id}
                      className="cursor-pointer select-none group text-white font-semibold pl-6 border-r border-slate-600 hover:bg-slate-600 transition-colors duration-150"
                      onClick={h.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        {sorted === "asc" && <ChevronUp className="h-3 w-3" />}
                        {sorted === "desc" && (
                          <ChevronDown className="h-3 w-3" />
                        )}
                        {!sorted && (
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <ChevronUp className="h-3 w-3 text-gray-300" />
                          </div>
                        )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="bg-gray-100 hover:bg-white transition-colors duration-150">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="pl-6">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* pagination */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="hover:bg-blue-50 hover:border-blue-300"
        >
          Previous
        </Button>
        <span className="text-sm">
          Page {pageIndex + 1} of {table.getPageCount()}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="hover:bg-blue-50 hover:border-blue-300"
        >
          Next
        </Button>
      </div>
    </div>
  );
} 