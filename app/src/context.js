"use client";
import { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext();

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function AppContextProvider({ children }) {
  const [token, setToken] = useState("token");
  const [date, setDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const todayStr = formatDate(today);
    setDate(todayStr);
  }, []);

  return (
    <AppContext.Provider value={{ token, setToken, date, setDate }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
