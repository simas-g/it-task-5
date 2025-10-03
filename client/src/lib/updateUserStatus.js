export async function updateStatus(ids, newStatus) {
  const url = `${import.meta.env.VITE_BASE_URL}/api/users/status`;
  const res = await fetch(url, {
    method: "PATCH",
    body: JSON.stringify({ status: newStatus, ids: ids }),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (res.status === 204) {
    return {
      success: true,
      message: "Status updated successfully (No content returned by server).",
    };
  }
  if (res.status === 400) {
    return "Your account must be active to perform action.";
  }
  const data = await res.json();
  return data;
}
