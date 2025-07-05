import * as React from "react";
import type { Employee } from "./employee-columns";
import { EmployeeCard } from "./EmployeeCard";
import { EmployeeDetailDialog } from "./EmployeeDetailDialog";

const PAGE_SIZE = 12;

type Props = {
  employees: Employee[];
};

export function EmployeesTiles({ employees }: Props) {
  const [selected, setSelected] = React.useState<Employee | null>(null);
  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE);
  const loaderRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    setVisibleCount(PAGE_SIZE); // reset on new data
  }, [employees]);

  React.useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < employees.length) {
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, employees.length));
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [employees, visibleCount]);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {employees.slice(0, visibleCount).map((emp) => (
          <EmployeeCard
            key={emp.id}
            emp={emp}
            onSelect={() => setSelected(emp)}
            onEdit={() => alert(`Edit ${emp.name}`)}
            onDelete={() => alert(`Delete ${emp.name}`)}
            onFlag={() => alert(`Flag ${emp.name}`)}
          />
        ))}
      </div>
      {/* Loader sentinel for infinite scroll */}
      <div ref={loaderRef} style={{ height: 1 }} />
      <EmployeeDetailDialog emp={selected} onClose={() => setSelected(null)} />
    </>
  );
} 