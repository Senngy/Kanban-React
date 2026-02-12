import api from "./api";

export const registerUser = async (user) => {
  return await api("/auth/register", "POST", user);
};

export const loginUser = async (credentials) => {
  const { token } = await api("/auth/login", "POST", credentials);
  const user = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
  return { token, user };

  // return { token };
};

export const getUser = async () => {
  return await api("/auth/me", "GET");
};
