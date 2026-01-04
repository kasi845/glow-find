const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

async function handleResponse(res: Response) {
  if (res.ok) return res.json();

  let message = "Request failed";
  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      const data = await res.json();
      message =
        (data && (data.detail || data.message || data.error)) ||
        JSON.stringify(data) ||
        message;
    } catch (err) {
      // fall through to text
    }
  }

  if (!contentType.includes("application/json")) {
    const text = await res.text();
    if (text) message = text;
  }

  throw new Error(message);
}

export async function apiSignup(data: { name: string; email: string; password: string }) {
  const res = await fetch(`${API_BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function apiLogin(data: { email: string; password: string }) {
  const body = new URLSearchParams();
  body.append("username", data.email);
  body.append("password", data.password);

  const res = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  return handleResponse(res);
}

export async function apiMe(token: string) {
  const res = await fetch(`${API_BASE_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
}

export async function apiGetUserStats(token: string) {
  const res = await fetch(`${API_BASE_URL}/users/me/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
}

export async function apiGetGlobalStats() {
  const res = await fetch(`${API_BASE_URL}/stats/global`);
  return handleResponse(res);
}

export async function apiUpdateUser(token: string, data: { name?: string; avatar?: string }) {
  const res = await fetch(`${API_BASE_URL}/users/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function apiCreateItem(
  payload: {
    itemtitle: string;
    location: string;
    date: string;
    contact: string;
    category: string;
    description: string;
    imageurl: string;
  },
  status: "lost" | "found",
  token: string
) {
  const res = await fetch(`${API_BASE_URL}/items/${status}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function apiUploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/upload-image`, {
    method: "POST",
    body: formData,
  });
  return handleResponse(res);
}

export async function apiGetItems(status?: "lost" | "found", search?: string) {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (search) params.append("search", search);

  const url = params.toString()
    ? `${API_BASE_URL}/items?${params.toString()}`
    : `${API_BASE_URL}/items`;

  const res = await fetch(url);
  return handleResponse(res);
}

export async function apiCreateClaim(
  payload: {
    itemId: string;
    itemTitle: string;
    claimerName: string;
    claimerEmail: string;
    claimerPhone: string;
    proofImage: string;
    description?: string;
  },
  token: string
) {
  const res = await fetch(`${API_BASE_URL}/claims`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function apiGetClaims(token: string, itemId?: string) {
  const url = itemId
    ? `${API_BASE_URL}/claims?itemId=${encodeURIComponent(itemId)}`
    : `${API_BASE_URL}/claims`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
}

export async function apiAcceptClaim(claimId: string, token: string) {
  const res = await fetch(`${API_BASE_URL}/claims/${claimId}/accept`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
}

export async function apiRejectClaim(claimId: string, token: string) {
  const res = await fetch(`${API_BASE_URL}/claims/${claimId}/reject`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
}


export async function apiMarkClaimDone(claimId: string, token: string) {
  const res = await fetch(`${API_BASE_URL}/claims/${claimId}/done`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
}

// Notification APIs
export async function apiGetNotifications(token: string) {
  const res = await fetch(`${API_BASE_URL}/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
}

export async function apiMarkNotificationRead(notificationId: string, token: string) {
  const res = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
}

// Message APIs
export async function apiSendMessage(
  payload: {
    receiverEmail: string;
    content: string;
    claimId: string;
  },
  token: string
) {
  const res = await fetch(`${API_BASE_URL}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function apiGetMessagesForClaim(claimId: string, token: string) {
  const res = await fetch(`${API_BASE_URL}/messages/claim/${claimId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
}

export async function apiGetConversations(token: string) {
  const res = await fetch(`${API_BASE_URL}/messages/conversations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
}

// Admin API
export async function apiGetAdminUsers(token: string) {
  const res = await fetch(`${API_BASE_URL}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
}

export async function apiDeleteUser(token: string, userId: string) {
  const res = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete user");
}

export async function apiBlockUser(token: string, userId: string) {
  const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/block`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to block user");
}

export async function apiUnblockUser(token: string, userId: string) {
  const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/unblock`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to unblock user");
}

export async function apiDeleteAdminItem(token: string, itemId: string) {
  const res = await fetch(`${API_BASE_URL}/admin/items/${itemId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete item");
}

export async function apiGetAdminReports(token: string) {
  const res = await fetch(`${API_BASE_URL}/admin/reports`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
}

export async function apiChat(message: string, history: any[]) {
  const res = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, history }),
  });
  return handleResponse(res);
}
