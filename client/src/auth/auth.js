export async function login({ email, password }) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/api/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      data.message || "Login failed due to an unknown server error."
    );
  }
  return data;
}

export async function register({ email, password, name }) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/api/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password, name }),
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      data.message || "Login failed due to an unknown server error."
    );
  }
  return data;
}

export async function checkSession() {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/api/auth/status`,
    {
      method: "GET",
      credentials: "include",
    }
  );
  return response.json();
}

export async function logout() {
  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Logout failed");
  }
  return res.json();
}
