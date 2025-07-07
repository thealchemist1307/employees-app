import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Employee } from "@/lib/api";
import { MoreVertical, Pencil, Flag, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type Props = {
  emp: Employee;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onFlag: () => void;
};

export function EmployeeCard({ emp, onSelect, onEdit, onDelete, onFlag }: Props) {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  return (
    <Card
      onClick={onSelect}
      className="cursor-pointer space-y-3 p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <Avatar>
          <AvatarFallback>{getInitials(emp.firstName, emp.lastName)}</AvatarFallback>
        </Avatar>
        {isAdmin && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="rounded-md p-1 hover:bg-muted"
                onClick={(e) => e.stopPropagation()}  /* prevent tile click */
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="w-4 h-4 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onFlag}>
                <Flag className="w-4 h-4 mr-2" /> Flag
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div>
        <h4 className="font-semibold">{emp.firstName} {emp.lastName}</h4>
        <p className="text-sm text-muted-foreground">{emp.email}</p>
        <Badge variant="outline" className="mt-2">
          {emp.company}
        </Badge>
      </div>
    </Card>
  );
}

function getInitials(firstName: string, lastName: string) {
  if (!firstName && !lastName) return "";
  if (!lastName) return firstName.substring(0, 2).toUpperCase();
  return (firstName[0] + lastName[0]).toUpperCase();
} 