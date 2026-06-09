import { User } from "../../types";

export const MOCK_USERS: User[] = [
  {
    id: "1",
    fullName: "Admin User",
    email: "admin@agrivet.com",
    address: "123 Admin Street, Manila",
    password: "admin123",
    avatar: undefined,
    role: "admin",
    pending_admin_approval: false,
    isApproved: true,
    createdAt: "2025-01-15T08:00:00Z",
  },
  {
    id: "2",
    fullName: "Maria Santos",
    email: "maria@agrivet.com",
    address: "456 Farm Road, Quezon City",
    password: "maria123",
    avatar: undefined,
    role: "user",
    pending_admin_approval: false,
    isApproved: true,
    createdAt: "2025-02-20T10:30:00Z",
  },
  {
    id: "3",
    fullName: "Juan Dela Cruz",
    email: "juan@agrivet.com",
    address: "789 Rural Lane, Cebu",
    password: "juan123",
    avatar: undefined,
    role: "user",
    pending_admin_approval: true,
    isApproved: false,
    createdAt: "2025-06-01T14:00:00Z",
  },
];

export const authApi = {
  delay: (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)),

  async login(email: string, password: string) {
    await this.delay(800);
    const user = MOCK_USERS.find((u) => u.email === email && u.password === password);
    if (!user) {
      throw new Error("Invalid credentials");
    }
    if (user.pending_admin_approval && !user.isApproved) {
      throw new Error("pending_approval");
    }
    return { user, token: "mock_token_" + user.id };
  },

  async register(data: { fullName: string; email: string; address: string; password: string }) {
    await this.delay(1000);
    const exists = MOCK_USERS.find((u) => u.email === data.email);
    if (exists) {
      throw new Error("Email already registered");
    }
    const newUser: User = {
      id: Date.now().toString(),
      ...data,
      role: "user",
      pending_admin_approval: true,
      isApproved: false,
      createdAt: new Date().toISOString(),
    };
    return { user: newUser, token: "mock_token_" + newUser.id };
  },
};
