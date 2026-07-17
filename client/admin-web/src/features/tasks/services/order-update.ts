import { apiFetch } from "../../../config/apiClient";
export async function updateBranchOrderStatus(id: string, status: string) {
  return apiFetch(`/branch-orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}