"use client";

import { createContext, useContext, useState, useEffect } from "react";

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users and statuses in parallel
        const [userResponse, statusResponse] = await Promise.all([
          fetch("/api/user/all"),
          fetch("/api/status/all"),
        ]);

        const [userData, statusData] = await Promise.all([
          userResponse.json(),
          statusResponse.json(),
        ]);

        setUsers(userData.users);
        setStatuses(statusData.statuses);
      } catch (error) {
        console.error("Error fetching global data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <ProjectContext.Provider value={{ users, statuses, isLoading }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjectContext() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjectContext must be used within a ProjectProvider");
  }
  return context;
}
