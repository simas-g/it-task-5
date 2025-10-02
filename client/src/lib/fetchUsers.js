export async function fetchUsers() {
  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/users`, {
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }
  return res.json();
}
