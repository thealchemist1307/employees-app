import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

export type Employee = {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: { name: string };
};

export const employeeColumns: ColumnDef<Employee>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "phone", header: "Phone" },
  {
    accessorKey: "company.name",
    header: "Company",
    cell: ({ row }) => row.original.company?.name ?? "",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => alert(`Edit ${row.original.name}`)}
          className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
        >
          Edit
        </Button>
        <Button 
          size="sm" 
          variant="destructive" 
          onClick={() => alert(`Delete ${row.original.name}`)}
          className="hover:bg-red-600 hover:border-red-600"
        >
          Delete
        </Button>
      </div>
    ),
  },
]; 