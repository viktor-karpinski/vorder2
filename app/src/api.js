"use client";
import { useAppContext } from "./context";

export function useApi() {
  const { token } = useAppContext();

  async function apiCall(path, { method = "GET", body = null } = {}) {
    const res = await fetch(`http://127.0.0.1:8000/${path}`, {
      method,
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    let data = await res.json();

    console.log(data);

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
