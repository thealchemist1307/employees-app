import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/jwt";

const db = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await hashPassword("admin123");
  const admin = await db.user.upsert({
    where: { email: "admin@ultrashiptms.com" },
    update: {},
    create: {
      email: "admin@ultrashiptms.com",
      password: adminPassword,
      name: "Admin User",
      role: "ADMIN",
    },
  });

  // Create employee user
  const employeePassword = await hashPassword("employee123");
  const employee = await db.user.upsert({
    where: { email: "employee@ultrashiptms.com" },
    update: {},
    create: {
      email: "employee@ultrashiptms.com",
      password: employeePassword,
      name: "Employee User",
      role: "EMPLOYEE",
    },
  });

  console.log("🌱 Seeded users:");
  console.log("  Admin:", admin.email, "(password: admin123)");
  console.log("  Employee:", employee.email, "(password: employee123)");
}

main().catch(console.error).finally(() => db.$disconnect()); 