export default async function api(endpoint, method = "GET", body) {

  const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined, // Include the body only if it's provided (not for GET requests)
    credentials: "include",
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      window.dispatchEvent(new Event("auth:logout"));
    }

    let message = `Erreur ${response.status}`;
    try {
      const errorData = await response.json();
      message = errorData.message || errorData.error || message;
    } catch {
      // si pas de JSON valide, on garde message par défaut
    }
    throw new Error(message);
  }

  try {
    const data = await response.json();
    return data;
  } catch {
    return {}; // Si la réponse n'est pas JSON, on retourne null
  }
}
