import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Employee } from "./employee-columns";

type Props = {
  emp: Employee | null;
  onClose: () => void;
};

export function EmployeeDetailDialog({ emp, onClose }: Props) {
  return (
    <Dialog open={!!emp} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{emp?.name}</DialogTitle>
        </DialogHeader>

        {emp && (
          <div className="grid grid-cols-2 gap-4 pt-4">
            <p><span className="font-medium">Email:</span> {emp.email}</p>
            <p><span className="font-medium">Phone:</span> {emp.phone}</p>
            <p><span className="font-medium">Company:</span> {emp.company?.name}</p>
            <p><span className="font-medium">ID:</span> {emp.id}</p>
            {/* add more fields as needed */}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 