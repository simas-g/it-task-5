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
  const data = await res.json();
  return data;
}
