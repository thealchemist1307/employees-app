import * as React from "react";

export type DataTableColumn<T> = {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
};

export type SortDir = "asc" | "desc";

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  sortField: keyof T;
  sortDir: SortDir;
  onSortChange: (field: keyof T) => void;
}

export function DataTable<T extends object>({ columns, data, sortField, sortDir, onSortChange }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded border bg-white">
      <table className="min-w-full text-sm">
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={String(col.key)}
                className={`px-3 py-2 text-left font-semibold transition-colors select-none ${
                  col.sortable ? "cursor-pointer hover:bg-slate-100" : ""
                }`}
                onClick={() => col.sortable && onSortChange(col.key)}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  {col.sortable && sortField === col.key && (
                    <span>
                      {sortDir === "asc" ? (
                        <svg width="12" height="12" viewBox="0 0 20 20" fill="none"><path d="M10 6l-4 4h8l-4-4z" fill="currentColor"/></svg>
                      ) : (
                        <svg width="12" height="12" viewBox="0 0 20 20" fill="none"><path d="M10 14l4-4H6l4 4z" fill="currentColor"/></svg>
                      )}
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-t">
              {columns.map(col => (
                <td key={String(col.key)} className="px-3 py-2">
                  {col.render ? col.render(row) : (row[col.key] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 