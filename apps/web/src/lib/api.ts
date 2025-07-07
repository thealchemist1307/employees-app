const API_URL = '/graphql';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'EMPLOYEE';
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  department: string;
  position: string;
  location: string;
  dateOfBirth: string;
  status: string;
  flagged?: boolean | null;
  created?: string | null;
  updated?: string | null;
  role: "ADMIN" | "EMPLOYEE";
}

export interface AuthPayload {
  token: string;
  user: User;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UserInput {
  email: string;
  password: string;
  name: string;
  role?: 'ADMIN' | 'EMPLOYEE';
}

export interface EmployeeInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  department: string;
  position: string;
  location: string;
  dateOfBirth: string;
  status: string;
  role: "ADMIN" | "EMPLOYEE";
}

export interface EmployeesPageResult {
  items: Employee[];
  total: number;
}

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private async graphqlRequest<T>(query: string, variables?: any): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    return result.data;
  }

  // Auth mutations
  async login(input: LoginInput): Promise<AuthPayload> {
    const query = `
      mutation Login($input: LoginInput!) {
        login(input: $input) {
          token
          user {
            id
            email
            firstName
            lastName
            name
            role
            createdAt
            updatedAt
          }
        }
      }
    `;

    const result = await this.graphqlRequest<{ login: AuthPayload }>(query, { input });
    return result.login;
  }

  async register(input: UserInput): Promise<AuthPayload> {
    const query = `
      mutation Register($input: UserInput!) {
        register(input: $input) {
          token
          user {
            id
            email
            firstName
            lastName
            name
            role
            createdAt
            updatedAt
          }
        }
      }
    `;

    const result = await this.graphqlRequest<{ register: AuthPayload }>(query, { input });
    return result.register;
  }

  async me(): Promise<User> {
    const query = `
      query Me {
        me {
          id
          email
          firstName
          lastName
          name
          role
          createdAt
          updatedAt
        }
      }
    `;

    const result = await this.graphqlRequest<{ me: User }>(query);
    return result.me;
  }

  // Employee queries
  async getEmployees(page: number = 1, size: number = 10, sortField: string = 'name', sortDir: string = 'asc', search: string = ""): Promise<EmployeesPageResult> {
    const query = `
      query Employees($page: Int, $size: Int, $sortField: SortField, $sortDir: SortDir, $search: String) {
        employees(page: $page, size: $size, sortField: $sortField, sortDir: $sortDir, search: $search) {
          items {
            id
            firstName
            lastName
            email
            phone
            company
            department
            position
            location
            dateOfBirth
            status
            flagged
            created
            updated
          }
          total
        }
      }
    `;

    const result = await this.graphqlRequest<{ employees: EmployeesPageResult }>(query, {
      page,
      size,
      sortField,
      sortDir,
      search,
    });
    return result.employees;
  }

  async getEmployee(id: string): Promise<Employee> {
    const query = `
      query Employee($id: ID!) {
        employee(id: $id) {
          id
          firstName
          lastName
          email
          phone
          company
          department
          position
          location
          dateOfBirth
          status
          flagged
          created
          updated
        }
      }
    `;

    const result = await this.graphqlRequest<{ employee: Employee }>(query, { id });
    return result.employee;
  }

  // Employee mutations
  async createEmployee(input: EmployeeInput): Promise<Employee> {
    const query = `
      mutation CreateEmployee($input: EmployeeInput!) {
        createEmployee(input: $input) {
          id
          firstName
          lastName
          email
          phone
          company
          department
          position
          location
          dateOfBirth
          status
          flagged
          created
          updated
        }
      }
    `;

    const result = await this.graphqlRequest<{ createEmployee: Employee }>(query, { input });
    return result.createEmployee;
  }

  async updateEmployee(id: string, input: EmployeeInput): Promise<Employee> {
    const query = `
      mutation UpdateEmployee($id: ID!, $input: EmployeeInput!) {
        updateEmployee(id: $id, input: $input) {
          id
          firstName
          lastName
          email
          phone
          company
          department
          position
          location
          dateOfBirth
          status
          flagged
          created
          updated
        }
      }
    `;

    const result = await this.graphqlRequest<{ updateEmployee: Employee }>(query, { id, input });
    return result.updateEmployee;
  }

  async deleteEmployee(id: string): Promise<boolean> {
    const query = `
      mutation DeleteEmployee($id: ID!) {
        deleteEmployee(id: $id)
      }
    `;

    const result = await this.graphqlRequest<{ deleteEmployee: boolean }>(query, { id });
    return result.deleteEmployee;
  }

  async flagEmployee(id: string, flag: boolean): Promise<Employee> {
    const query = `
      mutation FlagEmployee($id: ID!, $flag: Boolean!) {
        flagEmployee(id: $id, flag: $flag) {
          id
          firstName
          lastName
          email
          phone
          company
          department
          position
          location
          dateOfBirth
          status
          flagged
          created
          updated
        }
      }
    `;

    const result = await this.graphqlRequest<{ flagEmployee: Employee }>(query, { id, flag });
    return result.flagEmployee;
  }
}

export const apiClient = new ApiClient(); 