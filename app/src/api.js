"use client";
import { useContext } from "./context";

export function useApi() {
  const { token } = useContext();

  async function apiCall(path, { method = "GET", body = null } = {}) {
    const res = await fetch(`http://localhost:8000/api/${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    let data;
    try {
      data = await res.json();
    } catch {
      data = null;
    }

    if (!res.ok) {
      const error = new Error(data?.message || res.statusText);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  }

  const get = (path) => apiCall(path);
  const post = (path, body) => apiCall(path, { method: "POST", body });
  const put = (path, body) => apiCall(path, { method: "PUT", body });
  const del = (path) => apiCall(path, { method: "DELETE" });

  return { get, post, put, del };
}
