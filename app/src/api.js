"use client";
import { useAppContext } from "./context";

export function useApi() {
  const { token, setToken } = useAppContext();

  if (token === null || token === undefined || token.length < 1) {
    setToken(window.localStorage.getItem("secret"));
  }

  const apiCall = async (path, { method = "GET", body = null } = {}) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/${path}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      return await response.json();
    } catch (error) {
      console.log(error);
    }
  };

  const get = (path) => apiCall(path);
  const post = (path, body) => apiCall(path, { method: "POST", body });
  const put = (path, body) => apiCall(path, { method: "PUT", body });
  const del = (path) => apiCall(path, { method: "DELETE" });

  return { get, post, put, del };
}
