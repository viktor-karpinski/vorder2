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
  const [token, setToken] = useState(
    "2|MwoyUdOdFuj2CKDrewANaCNditqjPkEvGOzIgCnvd141b1ac"
  );
  const [date, setDate] = useState(() => {
    const today = new Date();
    return formatDate(today);
  });

  return (
    <AppContext.Provider value={{ token, setToken, date, setDate }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
