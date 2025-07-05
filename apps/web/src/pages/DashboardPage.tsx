import * as React from "react";
import { useAuth } from "@/context/AuthContext";
import { DataTable } from "@/components/table/DataTable";
import { employeeColumns } from "@/components/employee/employee-columns";
import type { Employee } from "@/components/employee/employee-columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { EmployeesTiles } from "@/components/employee/EmployeesTiles";
import { LayoutGrid, Rows } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = React.useState<Employee[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [view, setView] = React.useState<"grid" | "tile">("grid");
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    // Generate 3 pages worth of sample data (30 records)
    const sampleData: Employee[] = [
      { id: 1, name: "John Smith", email: "john.smith@company.com", phone: "+1-555-0101", company: { name: "TechCorp" } },
      { id: 2, name: "Sarah Johnson", email: "sarah.j@company.com", phone: "+1-555-0102", company: { name: "TechCorp" } },
      { id: 3, name: "Michael Brown", email: "michael.b@company.com", phone: "+1-555-0103", company: { name: "InnovateLabs" } },
      { id: 4, name: "Emily Davis", email: "emily.d@company.com", phone: "+1-555-0104", company: { name: "InnovateLabs" } },
      { id: 5, name: "David Wilson", email: "david.w@company.com", phone: "+1-555-0105", company: { name: "TechCorp" } },
      { id: 6, name: "Lisa Anderson", email: "lisa.a@company.com", phone: "+1-555-0106", company: { name: "DataFlow" } },
      { id: 7, name: "Robert Taylor", email: "robert.t@company.com", phone: "+1-555-0107", company: { name: "DataFlow" } },
      { id: 8, name: "Jennifer Martinez", email: "jennifer.m@company.com", phone: "+1-555-0108", company: { name: "TechCorp" } },
      { id: 9, name: "Christopher Garcia", email: "chris.g@company.com", phone: "+1-555-0109", company: { name: "InnovateLabs" } },
      { id: 10, name: "Amanda Rodriguez", email: "amanda.r@company.com", phone: "+1-555-0110", company: { name: "DataFlow" } },
      { id: 11, name: "James Lee", email: "james.l@company.com", phone: "+1-555-0111", company: { name: "TechCorp" } },
      { id: 12, name: "Michelle White", email: "michelle.w@company.com", phone: "+1-555-0112", company: { name: "InnovateLabs" } },
      { id: 13, name: "Daniel Thompson", email: "daniel.t@company.com", phone: "+1-555-0113", company: { name: "DataFlow" } },
      { id: 14, name: "Jessica Clark", email: "jessica.c@company.com", phone: "+1-555-0114", company: { name: "TechCorp" } },
      { id: 15, name: "Kevin Lewis", email: "kevin.l@company.com", phone: "+1-555-0115", company: { name: "InnovateLabs" } },
      { id: 16, name: "Nicole Hall", email: "nicole.h@company.com", phone: "+1-555-0116", company: { name: "DataFlow" } },
      { id: 17, name: "Steven Allen", email: "steven.a@company.com", phone: "+1-555-0117", company: { name: "TechCorp" } },
      { id: 18, name: "Rachel Young", email: "rachel.y@company.com", phone: "+1-555-0118", company: { name: "InnovateLabs" } },
      { id: 19, name: "Thomas King", email: "thomas.k@company.com", phone: "+1-555-0119", company: { name: "DataFlow" } },
      { id: 20, name: "Stephanie Wright", email: "stephanie.w@company.com", phone: "+1-555-0120", company: { name: "TechCorp" } },
      { id: 21, name: "Andrew Lopez", email: "andrew.l@company.com", phone: "+1-555-0121", company: { name: "InnovateLabs" } },
      { id: 22, name: "Melissa Hill", email: "melissa.h@company.com", phone: "+1-555-0122", company: { name: "DataFlow" } },
      { id: 23, name: "Ryan Scott", email: "ryan.s@company.com", phone: "+1-555-0123", company: { name: "TechCorp" } },
      { id: 24, name: "Ashley Green", email: "ashley.g@company.com", phone: "+1-555-0124", company: { name: "InnovateLabs" } },
      { id: 25, name: "Brandon Adams", email: "brandon.a@company.com", phone: "+1-555-0125", company: { name: "DataFlow" } },
      { id: 26, name: "Lauren Baker", email: "lauren.b@company.com", phone: "+1-555-0126", company: { name: "TechCorp" } },
      { id: 27, name: "Jason Nelson", email: "jason.n@company.com", phone: "+1-555-0127", company: { name: "InnovateLabs" } },
      { id: 28, name: "Rebecca Carter", email: "rebecca.c@company.com", phone: "+1-555-0128", company: { name: "DataFlow" } },
      { id: 29, name: "Justin Mitchell", email: "justin.m@company.com", phone: "+1-555-0129", company: { name: "TechCorp" } },
      { id: 30, name: "Hannah Perez", email: "hannah.p@company.com", phone: "+1-555-0130", company: { name: "InnovateLabs" } },
    ];
    setData(sampleData);
    setLoading(false);
  }, []);

  // Filter data by search string (case-insensitive, name/email/phone/company)
  const filteredData = React.useMemo(() => {
    if (!search.trim()) return data;
    const s = search.trim().toLowerCase();
    return data.filter(emp =>
      emp.name.toLowerCase().includes(s) ||
      emp.email.toLowerCase().includes(s) ||
      emp.phone.toLowerCase().includes(s) ||
      emp.company?.name.toLowerCase().includes(s)
    );
  }, [search, data]);

  return (
    <div className="flex min-h-screen flex-col items-center bg-slate-50 px-4 py-10 text-black">
      <div className="mb-6 flex w-full max-w-5xl items-center justify-between">
        <h2 className="text-2xl font-semibold">
          Welcome, {user?.name ?? "Anonymous"}!
        </h2>
        <Button 
          variant="destructive" 
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="hover:bg-red-600 hover:border-red-600"
        >
          Log out
        </Button>
      </div>

      <div className="w-full max-w-5xl">
        {loading ? (
          <p className="text-center">Loading data…</p>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <Input
                placeholder="Search employees…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-8 text-sm max-w-xs px-2 py-1"
              />
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
                        variant={view === "tile" ? "default" : "outline"}
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setView("tile")}
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
            {view === "grid" ? (
              <DataTable columns={employeeColumns} data={filteredData} />
            ) : (
              <EmployeesTiles employees={filteredData} />
            )}
          </div>
        )}
      </div>
    </div>
  );
} 