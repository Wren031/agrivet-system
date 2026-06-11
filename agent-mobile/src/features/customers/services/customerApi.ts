import { Customer } from "../../../types";

let customers: Customer[] = [
  {
    id: "c1",
    name: "Pedro Garcia",
    phone: "+63 917 123 4567",
    email: "pedro.garcia@email.com",
    region: "13",
    province: "miso",
    city: "cdo",
    barangay: "cdo-1",
    address: "12 Rizal Street, Cagayan de Oro City",
    avatar: undefined,
    createdAt: "2025-01-10T08:00:00Z",
  },
  {
    id: "c2",
    name: "Ana Reyes",
    phone: "+63 918 234 5678",
    email: "ana.reyes@email.com",
    region: "14",
    province: "davs",
    city: "dvo",
    barangay: "dvo-1",
    address: "45 Mabini Avenue, Davao City",
    avatar: undefined,
    createdAt: "2025-02-15T10:00:00Z",
  },
  {
    id: "c3",
    name: "Carlos Mendoza",
    phone: "+63 919 345 6789",
    email: "carlos.mendoza@email.com",
    region: "15",
    province: "sco",
    city: "gensan",
    barangay: "gensan-1",
    address: "89 Bonifacio Drive, General Santos City",
    avatar: undefined,
    createdAt: "2025-03-01T14:00:00Z",
  },
  {
    id: "c4",
    name: "Sofia Cruz",
    phone: "+63 920 456 7890",
    email: "sofia.cruz@email.com",
    region: "12",
    province: "zss",
    city: "zambo",
    barangay: "zambo-1",
    address: "23 Veterans Avenue, Zamboanga City",
    avatar: undefined,
    createdAt: "2025-04-20T09:00:00Z",
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const customerApi = {
  async getAll(): Promise<Customer[]> {
    await delay(600);
    return [...customers];
  },

  async getById(id: string): Promise<Customer | undefined> {
    await delay(400);
    return customers.find((c) => c.id === id);
  },

  async create(data: Omit<Customer, "id" | "createdAt">): Promise<Customer> {
    await delay(800);
    const newCustomer: Customer = {
      ...data,
      id: "c" + Date.now(),
      createdAt: new Date().toISOString(),
    };
    customers = [...customers, newCustomer];
    return newCustomer;
  },

  async update(id: string, data: Partial<Customer>): Promise<Customer> {
    await delay(600);
    const index = customers.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Customer not found");
    customers = customers.map((c) => (c.id === id ? { ...c, ...data } : c));
    return customers[index];
  },

  async remove(id: string): Promise<void> {
    await delay(500);
    customers = customers.filter((c) => c.id !== id);
  },
};
