import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { EmployeeInput } from "@/lib/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";

interface AddEmployeeDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (input: EmployeeInputWithRole) => void;
  isLoading?: boolean;
  apiError?: string | null;
}

const ROLE_OPTIONS = ["ADMIN", "EMPLOYEE"];

interface EmployeeInputWithRole extends EmployeeInput {
  role: "ADMIN" | "EMPLOYEE";
}

const initialState: EmployeeInputWithRole = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  department: "",
  position: "",
  location: "",
  dateOfBirth: "",
  status: "Active",
  role: "EMPLOYEE",
};

const STATUS_OPTIONS = ["Active", "On Leave", "Resigned"];

export function AddEmployeeDialog({ open, onClose, onSave, isLoading = false, apiError }: AddEmployeeDialogProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [form, setForm] = React.useState<EmployeeInputWithRole>(initialState);
  const [errors, setErrors] = React.useState<Partial<Record<keyof EmployeeInputWithRole, string>>>({});
  const [date, setDate] = React.useState<Date | null>(null);

  React.useEffect(() => {
    if (!open) {
      setForm(initialState);
      setErrors({});
      setDate(null);
    }
  }, [open]);

  function validate(): boolean {
    const newErrors: Partial<Record<keyof EmployeeInputWithRole, string>> = {};
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!form.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) newErrors.email = "Valid email required";
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    if (!form.company.trim()) newErrors.company = "Company is required";
    if (!form.department.trim()) newErrors.department = "Department is required";
    if (!form.position.trim()) newErrors.position = "Position is required";
    if (!form.location.trim()) newErrors.location = "Location is required";
    if (!form.dateOfBirth.trim()) newErrors.dateOfBirth = "Date of birth is required";
    if (!form.status.trim()) newErrors.status = "Status is required";
    if (!form.role) newErrors.role = "Role is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleDateChange(d: Date | null) {
    setDate(d);
    setForm({ ...form, dateOfBirth: d ? d.toISOString() : "" });
  }

  function handleSubmit(e: React.FormEvent | React.MouseEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSave(form);
  }

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg w-full p-0">
        <DialogHeader className="bg-primary text-white rounded-t-lg p-6 flex flex-col items-center relative">
          <DialogTitle className="text-2xl font-bold text-center w-full">Add Employee</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-0">
          <div>
            <div className="text-xs text-foreground mb-1">First Name</div>
            <Input name="firstName" value={form.firstName} onChange={handleChange} disabled={isLoading || !isAdmin} />
            {errors.firstName && <div className="text-xs text-red-500 mt-1">{errors.firstName}</div>}
          </div>
          <div>
            <div className="text-xs text-foreground mb-1">Last Name</div>
            <Input name="lastName" value={form.lastName} onChange={handleChange} disabled={isLoading || !isAdmin} />
            {errors.lastName && <div className="text-xs text-red-500 mt-1">{errors.lastName}</div>}
          </div>
          <div>
            <div className="text-xs text-foreground mb-1">Email</div>
            <Input name="email" value={form.email} onChange={handleChange} disabled={isLoading} />
            {errors.email && <div className="text-xs text-red-500 mt-1">{errors.email}</div>}
          </div>
          <div>
            <div className="text-xs text-foreground mb-1">Phone</div>
            <Input name="phone" value={form.phone} onChange={handleChange} disabled={isLoading} />
            {errors.phone && <div className="text-xs text-red-500 mt-1">{errors.phone}</div>}
          </div>
          <div>
            <div className="text-xs text-foreground mb-1">Company</div>
            <Input name="company" value={form.company} onChange={handleChange} disabled={isLoading} />
            {errors.company && <div className="text-xs text-red-500 mt-1">{errors.company}</div>}
          </div>
          <div>
            <div className="text-xs text-foreground mb-1">Department</div>
            <Input name="department" value={form.department} onChange={handleChange} disabled={isLoading} />
            {errors.department && <div className="text-xs text-red-500 mt-1">{errors.department}</div>}
          </div>
          <div>
            <div className="text-xs text-foreground mb-1">Position</div>
            <Input name="position" value={form.position} onChange={handleChange} disabled={isLoading} />
            {errors.position && <div className="text-xs text-red-500 mt-1">{errors.position}</div>}
          </div>
          <div>
            <div className="text-xs text-foreground mb-1">Location</div>
            <Input name="location" value={form.location} onChange={handleChange} disabled={isLoading} />
            {errors.location && <div className="text-xs text-red-500 mt-1">{errors.location}</div>}
          </div>
          <div>
            <div className="text-xs text-foreground mb-1">Date of Birth</div>
            <DatePicker
              selected={date}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              className="w-full border rounded px-2 py-1"
              placeholderText="Select date"
              disabled={isLoading}
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              maxDate={new Date()}
              isClearable
            />
            {form.dateOfBirth && date && <div className="text-xs text-foreground mt-1">{format(new Date(form.dateOfBirth), "yyyy-MM-dd")}</div>}
            {errors.dateOfBirth && <div className="text-xs text-red-500 mt-1">{errors.dateOfBirth}</div>}
          </div>
          <div>
            <div className="text-xs text-foreground mb-1">Status</div>
            <select
              name="status"
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
              disabled={isLoading}
              className="w-full border rounded px-2 py-1"
            >
              {STATUS_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {errors.status && <div className="text-xs text-red-500 mt-1">{errors.status}</div>}
          </div>
          <div>
            <div className="text-xs text-foreground mb-1">Role</div>
            <select
              name="role"
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value as "ADMIN" | "EMPLOYEE" })}
              disabled={isLoading}
              className="w-full border rounded px-2 py-1"
            >
              {ROLE_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {errors.role && <div className="text-xs text-red-500 mt-1">{errors.role}</div>}
          </div>
          {apiError && <div className="col-span-2 text-xs text-red-600 mt-2">{apiError}</div>}
        </form>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 justify-between items-center p-4 border-t">
          <DialogClose asChild>
            <Button variant="outline" className="w-full sm:w-auto" disabled={isLoading}>Cancel</Button>
          </DialogClose>
          <Button
            variant="default"
            className="w-full sm:w-auto bg-[#1E3A8A] text-white hover:bg-[#1e40af] hover:text-white"
            onClick={handleSubmit}
            disabled={isLoading || !isAdmin}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 