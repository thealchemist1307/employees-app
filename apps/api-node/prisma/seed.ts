import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const db = new PrismaClient();

const statuses = ["Active", "On_Leave", "Resigned"];
const departments = ["Engineering", "HR", "Sales", "Marketing", "Finance", "Support"];
const positions = ["Developer", "Manager", "Analyst", "Designer", "Lead", "Coordinator"];
const locations = ["New York", "London", "Berlin", "Tokyo", "Remote", "San Francisco"];

async function main() {
  await db.employee.deleteMany();
  const employees = Array.from({ length: 1000 }).map(() => ({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    company: faker.company.name(),
    department: faker.helpers.arrayElement(departments),
    position: faker.helpers.arrayElement(positions),
    location: faker.helpers.arrayElement(locations),
    dateOfBirth: faker.date.birthdate({ min: 22, max: 60, mode: 'age' }),
    status: faker.helpers.arrayElement(statuses) as any,
    flagged: faker.datatype.boolean(),
  }));
  await db.employee.createMany({ data: employees });
  console.log("🌱 Seeded:", employees.length);
}
main().catch(console.error).finally(() => db.$disconnect()); 