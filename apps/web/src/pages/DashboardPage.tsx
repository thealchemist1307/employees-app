import * as React from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, Rows } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { apiClient } from "@/lib/api";
import type { Employee, EmployeesPageResult } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/table/DataTable";
import type { DataTableColumn, SortDir } from "@/components/table/DataTable";
import { format } from "date-fns";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

function EmployeeTable({ employees }: { employees: Employee[] }) {
  return (
    <div className="overflow-x-auto rounded border bg-white">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-slate-100">
            <th className="px-3 py-2 text-left">Name</th>
            <th className="px-3 py-2 text-left">Email</th>
            <th className="px-3 py-2 text-left">Phone</th>
            <th className="px-3 py-2 text-left">Company</th>
            <th className="px-3 py-2 text-left">Department</th>
            <th className="px-3 py-2 text-left">Position</th>
            <th className="px-3 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id} className="border-t">
              <td className="px-3 py-2">{emp.name}</td>
              <td className="px-3 py-2">{emp.email}</td>
              <td className="px-3 py-2">{emp.phone}</td>
              <td className="px-3 py-2">{emp.company}</td>
              <td className="px-3 py-2">{emp.department}</td>
              <td className="px-3 py-2">{emp.position}</td>
              <td className="px-3 py-2">{emp.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmployeeTiles({ employees }: { employees: Employee[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {employees.map(emp => (
        <div key={emp.id} className="rounded border bg-white p-4 shadow-sm">
          <div className="font-semibold text-lg mb-1">{emp.name}</div>
          <div className="text-sm text-gray-600 mb-1">{emp.position} @ {emp.company}</div>
          <div className="text-xs text-gray-500 mb-1">{emp.department}</div>
          <div className="text-xs text-gray-500 mb-1">{emp.email}</div>
          <div className="text-xs text-gray-500 mb-1">{emp.phone}</div>
          <div className="text-xs text-gray-500">Status: {emp.status}</div>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = React.useState<"grid" | "tile">("grid");
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [sortField, setSortField] = React.useState<keyof Employee>("name");
  const [sortDir, setSortDir] = React.useState<SortDir>("asc");

  const columns: DataTableColumn<Employee>[] = [
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "phone", label: "Phone", sortable: true },
    { key: "company", label: "Company", sortable: true },
    { key: "department", label: "Department", sortable: true },
    { key: "position", label: "Position", sortable: true },
    { key: "status", label: "Status", sortable: true },
    { key: "created", label: "Created", sortable: true, render: (row) => row.created ? format(new Date(row.created), "yyyy-MM-dd HH:mm") : "-" },
    { key: "updated", label: "Updated", sortable: true, render: (row) => row.updated ? format(new Date(row.updated), "yyyy-MM-dd HH:mm") : "-" },
  ];

  const { data, isLoading, error } = useQuery<EmployeesPageResult, Error>({
    queryKey: ["employees", page, pageSize, search, sortField, sortDir],
    queryFn: () => apiClient.getEmployees(page, pageSize, sortField as string, sortDir),
  });

  const employees = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const isFirstPage = page === 1;
  const isLastPage = page === totalPages;
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  function PaginationControls() {
    return (
      <div className="flex items-center justify-between mb-2 mt-2">
        <div className="flex gap-2 items-center">
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={isFirstPage}>
            Previous
          </Button>
          {pageNumbers.map((num) => (
            <Button
              key={num}
              size="sm"
              variant={num === page ? "default" : "outline"}
              onClick={() => setPage(num)}
              className={num === page ? "font-bold" : ""}
            >
              {num}
            </Button>
          ))}
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={isLastPage}>
            Next
          </Button>
          <span className="ml-2 text-xs text-gray-500">Total: {total}</span>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-sm">Rows per page:</span>
          <select
            className="border rounded px-2 py-1 text-sm bg-background"
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            {PAGE_SIZE_OPTIONS.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  function handleSortChange(field: keyof Employee) {
    if (sortField === field) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setPage(1);
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-slate-50 px-4 py-10 text-black">
      <div className="mb-6 flex w-full max-w-5xl items-center justify-between">
        <h2 className="text-2xl font-semibold">
          Welcome, {user?.name ?? "Anonymous"}!
        </h2>
        <Button 
          variant="destructive" 
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="hover:bg-red-600 hover:border-red-600"
        >
          Log out
        </Button>
      </div>

      <div className="w-full max-w-5xl">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <Input
              placeholder="Search employees…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-8 text-sm max-w-xs px-2 py-1"
            />
            <TooltipProvider>
              <div className="flex gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={view === "grid" ? "default" : "outline"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setView("grid")}
                      aria-label="Grid view"
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Grid view</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={view === "tile" ? "default" : "outline"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setView("tile")}
                      aria-label="Tile view"
                    >
                      <Rows className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Tile view</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>

          <PaginationControls />

          {isLoading ? (
            <p className="text-center">Loading data…</p>
          ) : error ? (
            <div className="text-center text-red-600">{error.message}</div>
          ) : employees.length === 0 ? (
            <div className="text-center text-gray-500">No employees found.</div>
          ) : view === "grid" ? (
            <DataTable
              columns={columns}
              data={employees}
              sortField={sortField}
              sortDir={sortDir}
              onSortChange={handleSortChange}
            />
          ) : (
            <EmployeeTiles employees={employees} />
          )}

          <PaginationControls />
        </div>
      </div>
    </div>
  );
} 