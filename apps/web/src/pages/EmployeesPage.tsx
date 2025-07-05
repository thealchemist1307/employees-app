import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/table/DataTable";
import { employeeColumns, type Employee } from "@/components/employee/employee-columns";
import { EmployeesTiles } from "@/components/employee/EmployeesTiles";
import { Loader2 } from "lucide-react";

export default function EmployeesPage() {
  const [view, setView] = React.useState<"grid" | "tile">("grid");

  const { data: employees = [], isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: () =>
      fetch("https://jsonplaceholder.typicode.com/users")
        .then((r) => r.json()),
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Employees</h1>
        <Button variant="outline" onClick={() => setView(view === "grid" ? "tile" : "grid")}>
          {view === "grid" ? "Card view" : "Table view"}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : view === "grid" ? (
        <DataTable<Employee> columns={employeeColumns} data={employees} />
      ) : (
        <EmployeesTiles employees={employees} />
      )}
    </div>
  );
} 