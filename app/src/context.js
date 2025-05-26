"use client";
import { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext();
const WorspaceContext = createContext();

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

  const [macros, setMacros] = useState([]);
  const [micros, setMicros] = useState([]);
  const [meals, setMeals] = useState([]);

  return (
    <AppContext.Provider
      value={{
        token,
        setToken,
        date,
        setDate,
        macros,
        setMacros,
        micros,
        setMicros,
        meals,
        setMeals,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}

export function WorkspaceContextProvider({ children }) {
  const [workspaces, setWorkspaces] = useState([]);
  const [activeWorkspace, setActiveWorkspace] = useState(null);

  return (
    <WorspaceContext.Provider
      value={{ workspaces, setWorkspaces, activeWorkspace, setActiveWorkspace }}
    >
      {children}
    </WorspaceContext.Provider>
  );
}

export function useWorkspaceContext() {
  return useContext(WorspaceContext);
}
