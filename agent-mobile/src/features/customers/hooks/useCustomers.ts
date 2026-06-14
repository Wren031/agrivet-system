import { useState, useEffect, useCallback } from "react";
import { Customer } from "../../../types";
import { customerApi } from "../services/customerApi";

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await customerApi.getAll();
      setCustomers(data);
      setError("");
    } catch (e: any) {
      setError(e.message || "Failed to load customers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const addCustomer = async (data: Omit<Customer, "id" | "createdAt">) => {
    const newCustomer = await customerApi.create(data);
    setCustomers((prev) => [...prev, newCustomer]);
    return newCustomer;
  };

  const updateCustomer = async (id: string, data: Partial<Customer>) => {
    const updated = await customerApi.update(id, data);
    setCustomers((prev) => prev.map((c) => (c.id === id ? updated : c)));
    return updated;
  };

  const getCustomerById = async (id: string) => {
    return customerApi.getById(id);
  };

  const deleteCustomer = async (id: string) => {
    await customerApi.remove(id);
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    addCustomer,
    updateCustomer,
    getCustomerById,
    deleteCustomer,
  };
}
