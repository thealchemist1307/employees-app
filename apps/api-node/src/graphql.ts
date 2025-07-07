// debug log
console.log("→ DATABASE_URL:", process.env.DATABASE_URL);

import { gql } from "apollo-server-express";
import { PrismaClient, Prisma } from "@prisma/client";
import {
  SORT_FIELDS,
  SORT_DIRECTIONS,
  ROLES,
  SortFieldString,
  SortDirString,
  RoleString,
} from "./constants";
import {
  generateToken,
  hashPassword,
  comparePassword,
  JWTPayload,
} from "./utils/jwt";

const prisma = new PrismaClient();

/* GraphQL SDL -------------------------------------------------- */
export const typeDefs = gql`
  enum Role       { ADMIN EMPLOYEE }
  enum SortField  { name company department status created updated }
  enum SortDir    { asc desc }
  enum EmployeeStatus { Active On_Leave Resigned }

  type User {
    id: ID!
    email: String!
    name: String!
    firstName: String!
    lastName: String!
    role: Role!
    createdAt: String!
    updatedAt: String!
  }

  type Employee {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    phone: String!
    company: String!
    department: String!
    position: String!
    location: String!
    dateOfBirth: String!
    status: EmployeeStatus!
    flagged: Boolean
    created: String
    updated: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type EmployeesPage {
    items: [Employee!]!
    total: Int!
  }

  type Query {
    me: User
    employees(
      page: Int = 1
      size: Int = 10
      sortField: SortField = firstName
      sortDir: SortDir = asc
      search: String
    ): EmployeesPage!
    employee(id: ID!): Employee
  }

  input UserInput {
    email: String!
    password: String!
    name: String!
    role: Role
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input EmployeeInput {
    firstName: String!
    lastName: String!
    email: String!
    phone: String!
    company: String!
    department: String!
    position: String!
    location: String!
    dateOfBirth: String!
    status: EmployeeStatus!
    role: Role!
  }

  type Mutation {
    register(input: UserInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!

    createEmployee(input: EmployeeInput!): Employee!
    updateEmployee(id: ID!, input: EmployeeInput!): Employee!
    deleteEmployee(id: ID!): Boolean!
    flagEmployee(id: ID!, flag: Boolean!): Employee!
  }
`;

/* Context interface ------------------------------------------- */
export interface Context {
  user?: JWTPayload;
}

/* Helpers ------------------------------------------------------ */
function assertAuth(ctx: Context) {
  if (!ctx.user) throw new Error("Not authenticated");
}
function assertAdmin(ctx: Context) {
  assertAuth(ctx);
  if (ctx.user!.role !== "ADMIN") throw new Error("Admin access required");
}

/* Resolvers ---------------------------------------------------- */
export const resolvers = {
  Query: {
    me: (_: unknown, __: unknown, ctx: Context) => {
      assertAuth(ctx);
      return prisma.user.findUnique({ where: { id: ctx.user!.userId } });
    },

    employees: async (
      _: unknown,
      {
        page = 1,
        size = 10,
        sortField = "firstName",
        sortDir = "asc",
        search = "",
      }: {
        page: number;
        size: number;
        sortField: SortFieldString;
        sortDir: SortDirString;
        search?: string;
      },
      ctx: Context
    ) => {
      assertAuth(ctx);

      if (!SORT_FIELDS.includes(sortField) || !SORT_DIRECTIONS.includes(sortDir)) {
        throw new Error("Invalid sort parameters");
      }
      const skip = (page - 1) * size;
      // Only allow searching on visible fields for EMPLOYEE users
      const isAdmin = ctx.user?.role === "ADMIN";
      // Only used for search in employees query:
      const searchFields = [
        { firstName: { contains: search, mode: 'insensitive' as const } },
        { lastName: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } },
        { department: { contains: search, mode: 'insensitive' as const } },
        { position: { contains: search, mode: 'insensitive' as const } },
      ];
      const where = search
        ? {
            OR: searchFields,
          }
        : undefined;
      const [items, total] = await Promise.all([
        prisma.employee.findMany({
          skip,
          take: size,
          orderBy: { [sortField]: sortDir },
          where,
        }),
        prisma.employee.count({ where }),
      ]);
      return { items, total };
    },

    employee: (_: unknown, { id }: { id: number }, ctx: Context) => {
      assertAuth(ctx);
      return prisma.employee.findUnique({ where: { id: Number(id) } });
    },
  },

  Mutation: {
    /* ---------- Auth ---------- */
    register: async (_: unknown, { input }: { input: any }) => {
      const { email, password, name, role = "EMPLOYEE" } = input;
      const emailLower = email.toLowerCase();
      if (!ROLES.includes(role as RoleString)) throw new Error("Invalid role");
      if (await prisma.user.findUnique({ where: { email: emailLower } })) throw new Error("User already exists");

      const user = await prisma.user.create({
        data: {
          email: emailLower,
          password: await hashPassword(password),
          name,
          role,
        },
      });
      const [firstName, ...rest] = user.name.split(' ');
      const lastName = rest.join(' ');
      return {
        token: generateToken({ userId: user.id, email: emailLower, role }),
        user: { ...user, firstName, lastName, createdAt: user.createdAt.toISOString(), updatedAt: user.updatedAt.toISOString() },
      };
    },

    login: async (_: unknown, { input }: { input: any }) => {
      const { email, password } = input;
      const emailLower = email.toLowerCase();
      const user = await prisma.user.findUnique({ where: { email: emailLower } });
      if (!user || !(await comparePassword(password, user.password))) throw new Error("Invalid credentials");
      const [firstName, ...rest] = user.name.split(' ');
      const lastName = rest.join(' ');
      return {
        token: generateToken({ userId: user.id, email: emailLower, role: user.role }),
        user: { ...user, firstName, lastName, createdAt: user.createdAt.toISOString(), updatedAt: user.updatedAt.toISOString() },
      };
    },

    /* ---------- Employee CRUD ---------- */
    createEmployee: async (_: unknown, { input }: any, ctx: Context) => {
      assertAdmin(ctx);
      const { firstName, lastName, email, phone, company, department, position, location, dateOfBirth, status, role } = input;
      const emailLower = email.toLowerCase();
      const password = await hashPassword('password123');
      return await prisma.$transaction(async (prisma: Prisma.TransactionClient) => {
        const user = await prisma.user.create({
          data: { email: emailLower, name: firstName + ' ' + lastName, role, password }
        });
        const employee = await prisma.employee.create({
          data: { firstName, lastName, email: emailLower, phone, company, department, position, location, dateOfBirth: new Date(dateOfBirth), status }
        });
        return employee;
      });
    },
    updateEmployee: (_: unknown, { id, input }: any, ctx: Context) => {
      assertAdmin(ctx);
      return prisma.employee.update({ where: { id: Number(id) }, data: input });
    },
    deleteEmployee: (_: unknown, { id }: any, ctx: Context) => {
      assertAdmin(ctx);
      return prisma.employee.delete({ where: { id: Number(id) } }).then(() => true);
    },
    flagEmployee: (_: unknown, { id, flag }: { id: number; flag: boolean }, ctx: Context) => {
      assertAuth(ctx);
      return prisma.employee.update({ where: { id: Number(id) }, data: { flagged: flag } });
    },
  },

  /* ---------- Field Serialisers ---------- */
  Employee: {
    dateOfBirth: (e: any) => e.dateOfBirth.toISOString(),
    created: (e: any, _: unknown, ctx: Context) => ctx.user?.role !== "ADMIN" ? null : e.created.toISOString(),
    updated: (e: any, _: unknown, ctx: Context) => ctx.user?.role !== "ADMIN" ? null : e.updated.toISOString(),
    flagged: (e: any, _: unknown, ctx: Context) => {
      // Only show flagged status to admins
      if (ctx.user?.role !== "ADMIN") return null;
      return e.flagged;
    },
  },
}; 