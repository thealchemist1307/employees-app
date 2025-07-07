import { gql } from "apollo-server-express";
import { PrismaClient } from "@prisma/client";
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
  enum SortField  { name company department status }
  enum SortDir    { asc desc }

  type User {
    id: ID!
    email: String!
    name: String!
    role: Role!
    createdAt: String!
    updatedAt: String!
  }

  type Employee {
    id: ID!
    name: String!
    email: String!
    phone: String!
    company: String!
    department: String!
    position: String!
    location: String!
    dateOfBirth: String!
    status: String!
    flagged: Boolean!
    created: String!
    updated: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
    employees(
      sortField: SortField = name
      sortDir: SortDir = asc
    ): [Employee!]!
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
    name: String!
    email: String!
    phone: String!
    company: String!
    department: String!
    position: String!
    location: String!
    dateOfBirth: String!
    status: String!
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

    employees: (
      _: unknown,
      { sortField = "name", sortDir = "asc" }: { sortField: SortFieldString; sortDir: SortDirString },
      ctx: Context
    ) => {
      assertAuth(ctx);
      if (!SORT_FIELDS.includes(sortField) || !SORT_DIRECTIONS.includes(sortDir)) {
        throw new Error("Invalid sort parameters");
      }
      return prisma.employee.findMany({ orderBy: { [sortField]: sortDir } });
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
      if (!ROLES.includes(role as RoleString)) throw new Error("Invalid role");
      if (await prisma.user.findUnique({ where: { email } })) throw new Error("User already exists");

      const user = await prisma.user.create({
        data: {
          email,
          password: await hashPassword(password),
          name,
          role,
        },
      });
      return {
        token: generateToken({ userId: user.id, email, role }),
        user: { ...user, createdAt: user.createdAt.toISOString(), updatedAt: user.updatedAt.toISOString() },
      };
    },

    login: async (_: unknown, { input }: { input: any }) => {
      const { email, password } = input;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !(await comparePassword(password, user.password))) throw new Error("Invalid credentials");
      return {
        token: generateToken({ userId: user.id, email, role: user.role }),
        user: { ...user, createdAt: user.createdAt.toISOString(), updatedAt: user.updatedAt.toISOString() },
      };
    },

    /* ---------- Employee CRUD ---------- */
    createEmployee: (_: unknown, { input }: any, ctx: Context) => {
      assertAdmin(ctx);
      return prisma.employee.create({ data: input });
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
    created:     (e: any) => e.created.toISOString(),
    updated:     (e: any) => e.updated.toISOString(),
  },
}; 