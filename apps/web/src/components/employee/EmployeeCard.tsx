import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Employee } from "./employee-columns";
import { MoreVertical } from "lucide-react";

type Props = {
  emp: Employee;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onFlag: () => void;
};

export function EmployeeCard({ emp, onSelect, onEdit, onDelete, onFlag }: Props) {
  return (
    <Card
      onClick={onSelect}
      className="cursor-pointer space-y-3 p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <Avatar>
          <AvatarFallback>{emp.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
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
            <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={onFlag}>Flag</DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div>
        <h4 className="font-semibold">{emp.name}</h4>
        <p className="text-sm text-muted-foreground">{emp.email}</p>
        <Badge variant="outline" className="mt-2">
          {emp.company?.name}
        </Badge>
      </div>
    </Card>
  );
} 