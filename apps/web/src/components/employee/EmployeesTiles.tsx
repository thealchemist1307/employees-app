import * as React from "react";
import type { Employee } from "@/lib/api";
import { EmployeeCard } from "./EmployeeCard";
import { EmployeeDetailDialog } from "./EmployeeDetailDialog";

type Props = {
  employees: Employee[];
  onEdit: (emp: Employee) => void;
  onDelete: (emp: Employee) => void;
};

export function EmployeesTiles({ employees, onEdit, onDelete }: Props) {
  const [selected, setSelected] = React.useState<Employee | null>(null);
  const [editMode, setEditMode] = React.useState(false);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {employees.map((emp, idx) => (
          <EmployeeCard
            key={`${emp.id}-${idx}`}
            emp={emp}
            onSelect={() => { setSelected(emp); setEditMode(false); }}
            onEdit={() => { setSelected(emp); setEditMode(true); onEdit(emp); }}
            onDelete={() => onDelete(emp)}
            onFlag={() => alert(`Flag ${emp.firstName} ${emp.lastName}`)}
          />
        ))}
      </div>
      <EmployeeDetailDialog
        employee={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        mode={editMode ? "edit" : "view"}
      />
    </>
  );
} 