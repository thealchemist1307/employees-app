import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import type { Employee } from "@/lib/api";

export const employeeColumns: ColumnDef<Employee>[] = [
  { accessorKey: "firstName", header: "First Name" },
  { accessorKey: "lastName", header: "Last Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "phone", header: "Phone" },
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => row.original.company ?? "",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => alert(`Edit ${row.original.firstName} ${row.original.lastName}`)}
          className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
        >
          Edit
        </Button>
        <Button 
          size="sm" 
          variant="destructive" 
          onClick={() => alert(`Delete ${row.original.firstName} ${row.original.lastName}`)}
          className="hover:bg-red-600 hover:border-red-600"
        >
          Delete
        </Button>
      </div>
    ),
  },
]; 