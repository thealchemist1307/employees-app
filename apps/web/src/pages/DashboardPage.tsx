import * as React from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LayoutGrid, Rows, Loader2, Plus, MoreVertical, Search } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { apiClient } from "@/lib/api";
import type { Employee, EmployeesPageResult, EmployeeInput } from "@/lib/api";
import { useQuery, useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { DataTable } from "@/components/table/DataTable";
import type { DataTableColumn, SortDir } from "@/components/table/DataTable";
import { format } from "date-fns";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { stringToInitials } from "@/lib/utils";
import { EmployeeDetailDialog } from "@/components/employee/EmployeeDetailDialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddEmployeeDialog } from "@/components/employee/AddEmployeeDialog";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];
const VIEW_MODE_KEY = "employeeViewMode";

type EmployeeInputWithRole = EmployeeInput & { role: "ADMIN" | "EMPLOYEE" };

function EmployeeTiles({ employees, onCardClick }: { employees: Employee[]; onCardClick: (emp: Employee) => void }) {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {employees.map(emp => (
        <div
          key={emp.id}
          className="relative rounded border bg-white p-4 shadow-sm flex flex-col items-center cursor-pointer transition-all duration-150 hover:shadow-lg hover:border-blue-400 focus-within:shadow-lg focus-within:border-blue-500 group overflow-hidden"
          tabIndex={0}
          onClick={() => onCardClick(emp)}
        >
          <span className="pointer-events-none absolute inset-0 group-active:animate-ripple bg-blue-100/40 rounded" />
          {isAdmin && (
            <div className="absolute top-2 right-2 z-10">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button type="button" className="p-1 rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-400">
                    <MoreVertical className="h-5 w-5 text-gray-500" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => {/* TODO: Edit action */}}>Edit</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {/* TODO: Delete action */}}>Delete</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {/* TODO: Flag action */}}>Flag</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          <div className="mb-2 z-10">
            <div className="w-14 h-14 rounded-full bg-blue-200 flex items-center justify-center text-2xl font-bold text-blue-800">
              {stringToInitials((emp.firstName || '') + ' ' + (emp.lastName || ''))}
            </div>
          </div>
          <div className="font-semibold text-lg mb-1 text-center z-10">{emp.firstName} {emp.lastName}</div>
          <div className="text-xs text-gray-500 mb-1 text-center z-10">{emp.email}</div>
          <div className="text-xs text-gray-500 mb-1 text-center z-10">{emp.company}</div>
          <div className="text-xs text-gray-500 text-center z-10">{emp.department}</div>
        </div>
      ))}
    </div>
  );
}

function delay<T>(ms: number, value: T): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [view, setView] = React.useState<'grid' | 'tiles'>(() => {
    const saved = localStorage.getItem(VIEW_MODE_KEY);
    return saved === 'grid' || saved === 'tiles' ? saved : 'grid';
  });
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [sortField, setSortField] = React.useState<keyof Employee>("updated");
  const [sortDir, setSortDir] = React.useState<SortDir>("desc");
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [selectedEmployee, setSelectedEmployee] = React.useState<Employee | null>(null);
  const queryClient = useQueryClient();
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [addApiError, setAddApiError] = React.useState<string | null>(null);
  const [showPasswordMsg, setShowPasswordMsg] = React.useState(false);
  const [createdEmployeeEmail, setCreatedEmployeeEmail] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const sortableFields = ["name", "company", "department", "status", "created", "updated"] as const;

  const isAdmin = user?.role === "ADMIN";

  const columns: DataTableColumn<Employee>[] = [
    { key: "firstName", label: "First Name", sortable: true },
    { key: "lastName", label: "Last Name", sortable: true },
    { key: "email", label: "Email", sortable: false },
    { key: "phone", label: "Phone", sortable: false },
    { key: "company", label: "Company", sortable: true },
    { key: "department", label: "Department", sortable: true },
    { key: "position", label: "Position", sortable: false },
    { key: "status", label: "Status", sortable: true },
    ...(isAdmin ? [
      { key: "created" as keyof Employee, label: "Created", sortable: true, render: (row: Employee) => row.created ? format(new Date(row.created), "yyyy-MM-dd HH:mm") : "-" },
      { key: "updated" as keyof Employee, label: "Updated", sortable: true, render: (row: Employee) => row.updated ? format(new Date(row.updated), "yyyy-MM-dd HH:mm") : "-" },
    ] : [])
  ];

  const { data, isLoading, error } = useQuery<EmployeesPageResult, Error>({
    queryKey: ["employees", page, pageSize, search, sortField, sortDir],
    queryFn: () => apiClient.getEmployees(page, pageSize, sortField as string, sortDir, search),
  });

  const {
    data: tileData,
    isLoading: tileLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<EmployeesPageResult, Error>({
    queryKey: ["employees-tile", search, sortField, sortDir],
    queryFn: async ({ pageParam }) => {
      const data = await apiClient.getEmployees((pageParam as number) ?? 1, pageSize, sortField as string, sortDir, search);
      return delay(400, data);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: EmployeesPageResult, allPages: EmployeesPageResult[]) => {
      const loaded = allPages.reduce((acc: number, p: EmployeesPageResult) => acc + p.items.length, 0);
      return loaded < lastPage.total ? allPages.length + 1 : undefined;
    },
  });

  const employees = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const isFirstPage = page === 1;
  const isLastPage = page === totalPages;
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const tileEmployees: Employee[] = (tileData as InfiniteData<EmployeesPageResult> | undefined)?.pages.flatMap((p) => p.items) ?? [];

  // Deduplicate employees by id for tile view
  const uniqueTileEmployees = tileEmployees.filter(
    (emp, idx, arr) => arr.findIndex(e => e.id === emp.id) === idx
  );

  const updateMutation = useMutation({
    mutationFn: (emp: Employee) => {
      const { firstName, lastName, email, phone, company, department, position, location, dateOfBirth, status } = emp;
      return apiClient.updateEmployee(emp.id, { firstName, lastName, email, phone, company, department, position, location, dateOfBirth, status, role: emp.role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["employee"] });
      setDetailOpen(false);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    },
    onError: (error) => {
      console.error("Failed to update employee:", error);
    },
  });

  const addEmployeeMutation = useMutation<Employee, Error, EmployeeInputWithRole>({
    mutationFn: (input: EmployeeInputWithRole) => apiClient.createEmployee(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setAddDialogOpen(false);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      setAddApiError(null);
      setTimeout(() => setShowPasswordMsg(false), 5000);
    },
    onError: (err: any) => {
      setAddApiError(err?.message || "Failed to add employee");
    },
  });

  const deleteEmployeeMutation = useMutation<boolean, Error, string>({
    mutationFn: (id: string) => apiClient.deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["employees-tile"] });
      setDetailOpen(false);
      setShowSuccessMessage(true);
      setSuccessMsg("Employee deleted successfully!");
      setTimeout(() => setShowSuccessMessage(false), 3000);
      setTimeout(() => setSuccessMsg(null), 3000);
    },
    onError: (err: any) => {
      setErrorMsg(err?.message || "Failed to delete employee");
      setTimeout(() => setErrorMsg(null), 3000);
    },
  });

  React.useEffect(() => {
    if (view !== "tiles") return;
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
        !tileLoading && hasNextPage
      ) {
        fetchNextPage();
      }
    };
    window.addEventListener("scroll", onScroll);
    // Auto-fetch if not scrollable and more data is available
    function autoFetchIfNeeded() {
      if (
        document.body.scrollHeight <= window.innerHeight + 100 &&
        !tileLoading && hasNextPage
      ) {
        fetchNextPage();
      }
    }
    autoFetchIfNeeded();
    return () => window.removeEventListener("scroll", onScroll);
  }, [view, tileLoading, hasNextPage, fetchNextPage, tileEmployees.length]);

  React.useEffect(() => {
    localStorage.setItem(VIEW_MODE_KEY, view);
  }, [view]);

  function PaginationControls() {
    function getPageButtons() {
      if (totalPages <= 5) return pageNumbers;
      const pages = [];
      // Always show first 1, 2, 3
      pages.push(1);
      if (page > 3 && page < totalPages - 2) {
        pages.push('...');
        pages.push(page - 1);
        pages.push(page);
        pages.push(page + 1);
        pages.push('...');
      } else if (page <= 3) {
        pages.push(2);
        pages.push(3);
        pages.push('...');
      } else if (page >= totalPages - 2) {
        pages.push('...');
        pages.push(totalPages - 2);
        pages.push(totalPages - 1);
      }
      pages.push(totalPages);
      // Remove duplicates and sort, only keep numbers
      return [...new Set(pages)].filter(p => typeof p === 'number' && p >= 1 && p <= totalPages);
    }
    const buttons = getPageButtons();
    return (
      <div className="flex items-center justify-between mb-2 mt-2">
        <div className="flex gap-2 items-center">
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={isFirstPage}>
            Previous
          </Button>
          {buttons.map((num, idx) =>
            num === '...'
              ? <span key={"ellipsis-" + idx} className="px-2">…</span>
              : <Button
                  key={num}
                  size="sm"
                  variant={num === page ? "default" : "outline"}
                  onClick={() => setPage(Number(num))}
                  className={num === page ? "font-bold" : ""}
                >
                  {num}
                </Button>
          )}
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
    if (!(sortableFields as readonly string[]).includes(field as string)) return;
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
      <div className="w-[100vw] max-w-screen-xl mx-auto">
        <div className="mb-6 flex w-full items-center justify-between">
          <h2 className="text-2xl font-semibold">
            Welcome, {user?.name ?? "Anonymous"}!
          </h2>
          <Button 
            variant="default"
            className="flex items-center gap-2 bg-[#1E3A8A] text-white hover:bg-[#1e40af] hover:text-white shadow"
            onClick={() => setAddDialogOpen(true)}
          >
            <Plus className="h-5 w-5" />
            Add
          </Button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="relative max-w-xs w-full">
              <Input
                placeholder="Search employees…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-8 text-sm pl-8 pr-2 py-1 w-full"
              />
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
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
                      variant={view === "tiles" ? "default" : "outline"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setView("tiles")}
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

          {view === "grid" && <PaginationControls />}

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              <span className="ml-2 text-blue-700 font-medium">Loading data…</span>
            </div>
          ) : error ? (
            <div className="text-center text-red-600">{error.message}</div>
          ) : view === "grid" ? (
            <>
              <DataTable
                columns={columns}
                data={employees}
                sortField={sortField}
                sortDir={sortDir}
                onSortChange={handleSortChange}
                onRowClick={(emp) => { setSelectedEmployee(emp); setDetailOpen(true); }}
              />
              <PaginationControls />
            </>
          ) : (
            <>
              <div className="mb-2 text-sm text-gray-600">Total cards rendered: {uniqueTileEmployees.length}</div>
              <div>
                <EmployeeTiles employees={uniqueTileEmployees} onCardClick={(emp) => { setSelectedEmployee(emp); setDetailOpen(true); }} />
                {isFetchingNextPage && (
                  <div className="flex flex-col items-center py-8 w-full">
                    <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                    <span className="mt-2 text-blue-700 font-medium">Loading more…</span>
                  </div>
                )}
              </div>
              {uniqueTileEmployees.length === 0 && !isFetchingNextPage && (
                <div className="text-center text-gray-500">No employees found.</div>
              )}
            </>
          )}
        </div>
      </div>
      <EmployeeDetailDialog
        employee={selectedEmployee}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        mode="view"
        onEdit={(emp) => updateMutation.mutate(emp)}
        isLoading={updateMutation.isPending || deleteEmployeeMutation.isPending}
        onDelete={(emp) => deleteEmployeeMutation.mutate(emp.id)}
      />
      <AddEmployeeDialog
        open={addDialogOpen}
        onClose={() => { setAddDialogOpen(false); setAddApiError(null); }}
        onSave={(input: EmployeeInputWithRole) => {
          addEmployeeMutation.mutate(input);
          setShowPasswordMsg(true);
          setCreatedEmployeeEmail(input.email);
        }}
        isLoading={addEmployeeMutation.isPending}
        apiError={addApiError}
      />
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-right">
          Employee updated successfully!
        </div>
      )}
      {showPasswordMsg && createdEmployeeEmail && (
        <div className="fixed top-20 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-right">
          Employee created. Login credentials: <b>{createdEmployeeEmail}</b>, password: <b>password123</b>
        </div>
      )}
      {successMsg && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-right">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-right">
          {errorMsg}
        </div>
      )}
    </div>
  );
} 