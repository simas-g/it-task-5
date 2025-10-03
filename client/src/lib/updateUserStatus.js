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
  if (!res.ok) {
    let errorData = { message: `Update failed with status: ${res.status}` };
    try {
      const errorBody = await res.clone().json();
      if (errorBody && errorBody.message) {
        errorData = errorBody;
      }
    } catch (e) {}
    throw new Error(errorData.message);
  }
  if (res.status === 204) {
    return { message: "Status updated successfully" };
  }
  try {
    const data = await res.json();
    return data;
  } catch (e) {
    return { message: "Status updated successfully, but response was empty." };
  }
}
