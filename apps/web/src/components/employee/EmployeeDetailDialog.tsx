import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import type { Employee } from "@/lib/api";
import { stringToInitials } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

interface EmployeeDetailDialogProps {
  employee: Employee | null;
  open: boolean;
  onClose: () => void;
  mode: "view" | "edit";
  onEdit?: (emp: Employee) => void;
  onDelete?: (emp: Employee) => void;
  isLoading?: boolean;
}

export function EmployeeDetailDialog({ employee, open, onClose, mode: initialMode = "view", onEdit, onDelete, isLoading = false }: EmployeeDetailDialogProps) {
  const { user } = useAuth();
  const [editData, setEditData] = React.useState<Employee | null>(employee);
  const [mode, setMode] = React.useState<"view" | "edit">(initialMode);

  const STATUS_OPTIONS = ["Active", "On Leave", "Resigned"];

  React.useEffect(() => {
    setEditData(employee);
    setMode(initialMode);
  }, [employee, initialMode]);

  if (!employee) return null;

  const isEdit = mode === "edit";
  const isAdmin = user?.role === "ADMIN";

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    if (!editData) return;
    setEditData({ ...editData, [e.target.name]: e.target.value });
  }

  function handleToggleMode() {
    setMode((prev) => (prev === "edit" ? "view" : "edit"));
  }

  function handleSave() {
    if (onEdit && editData) onEdit(editData);
    setMode("view");
  }

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg w-full p-0">
        <DialogHeader className="bg-[#1E3A8A] text-white rounded-t-lg p-6 flex flex-col items-center relative">
          <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center text-4xl font-bold text-[#1E3A8A] mb-2">
            {stringToInitials(employee.firstName + ' ' + employee.lastName)}
          </div>
          <DialogTitle className="text-2xl font-bold text-center w-full">{employee.firstName} {employee.lastName}</DialogTitle>
          <div className="text-sm text-white text-center w-full ">{employee.email}</div>
        </DialogHeader>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-0">
          <div>
            <div className="text-xs text-neutral-900 mb-1">First Name</div>
            {isEdit ? (
              <Input name="firstName" value={editData?.firstName ?? ""} onChange={handleChange} />
            ) : (
              <div className="font-medium text-foreground">{employee.firstName}</div>
            )}
          </div>
          <div>
            <div className="text-xs text-neutral-900 mb-1">Last Name</div>
            {isEdit ? (
              <Input name="lastName" value={editData?.lastName ?? ""} onChange={handleChange} />
            ) : (
              <div className="font-medium text-foreground">{employee.lastName}</div>
            )}
          </div>
          <div>
            <div className="text-xs text-neutral-900 mb-1">Company</div>
            {isEdit ? (
              <Input name="company" value={editData?.company ?? ""} onChange={handleChange} />
            ) : (
              <div className="font-medium text-foreground">{employee.company}</div>
            )}
          </div>
          <div>
            <div className="text-xs text-neutral-900 mb-1">Department</div>
            {isEdit ? (
              <Input name="department" value={editData?.department ?? ""} onChange={handleChange} />
            ) : (
              <div className="font-medium text-foreground">{employee.department}</div>
            )}
          </div>
          <div>
            <div className="text-xs text-neutral-900 mb-1">Phone</div>
            {isEdit ? (
              <Input name="phone" value={editData?.phone ?? ""} onChange={handleChange} />
            ) : (
              <div className="font-medium text-foreground">{employee.phone}</div>
            )}
          </div>
          <div>
            <div className="text-xs text-neutral-900 mb-1">Position</div>
            {isEdit ? (
              <Input name="position" value={editData?.position ?? ""} onChange={handleChange} />
            ) : (
              <div className="font-medium text-foreground">{employee.position}</div>
            )}
          </div>
          <div>
            <div className="text-xs text-neutral-900 mb-1">Location</div>
            {isEdit ? (
              <Input name="location" value={editData?.location ?? ""} onChange={handleChange} />
            ) : (
              <div className="font-medium text-foreground">{employee.location}</div>
            )}
          </div>
          <div>
            <div className="text-xs text-neutral-900 mb-1">Date of Birth</div>
            {isEdit ? (
              <Input name="dateOfBirth" value={editData?.dateOfBirth ?? ""} onChange={handleChange} />
            ) : (
              <div className="font-medium text-foreground">{employee.dateOfBirth ? format(new Date(employee.dateOfBirth), "yyyy-MM-dd") : "-"}</div>
            )}
          </div>
          <div>
            <div className="text-xs text-neutral-900 mb-1">Status</div>
            {isEdit ? (
              <select
                name="status"
                value={editData?.status ?? ""}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              >
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <div className="font-medium text-foreground">{employee.status}</div>
            )}
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 justify-between items-center p-4 border-t">
          <DialogClose asChild>
            <Button variant="outline" className="w-full sm:w-auto" disabled={isLoading}>Close</Button>
          </DialogClose>
          {isAdmin && (
            <>
              <Button
                variant="default"
                className="w-full sm:w-auto bg-[#1E3A8A] text-white hover:bg-[#1e40af] hover:text-white"
                onClick={handleToggleMode}
                disabled={isLoading}
              >
                {isEdit ? "View" : "Edit"}
              </Button>
              <Button variant="destructive" className="w-full sm:w-auto" onClick={() => onDelete && onDelete(employee)} disabled={isLoading}>Delete</Button>
            </>
          )}
          {isEdit && (
            <Button
              variant="default"
              className="w-full sm:w-auto bg-[#1E3A8A] text-white hover:bg-[#1e40af] hover:text-white"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 