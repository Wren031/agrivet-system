import { apiFetch } from "../../../config/apiClient";

export async function updateOrderBranchStatus(orderId: string, status: string) {
  return apiFetch(`/branch-orders/${orderId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}