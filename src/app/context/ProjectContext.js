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

  const addStatus = async (name) => {
    try {
      const response = await fetch('/api/status/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        const newStatus = await response.json();
        setStatuses([...statuses, newStatus]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding status:', error);
      return false;
    }
  };

  const deleteStatus = async (id) => {
    try {
      const response = await fetch(`/api/status/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setStatuses(statuses.filter(status => status.id !== id));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting status:', error);
      return false;
    }
  };

  return (
    <ProjectContext.Provider value={{ 
      users, 
      statuses, 
      isLoading,
      addStatus,
      deleteStatus
    }}>
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
