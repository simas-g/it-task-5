export async function deleteUsers(ids) {
  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/users/delete`, {
    method: "DELETE",
    body: JSON.stringify({ ids: ids }),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data);
  } else return data;
}
