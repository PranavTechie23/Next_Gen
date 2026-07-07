import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { studentApi } from "@/services/studentApi";
import {
  DASHBOARD_CACHE_KEYS,
  readDashboardCache,
  writeDashboardCache,
  clearAllDashboardCaches,
} from "@/lib/dashboardCache";
import { clearClientAuthState } from "@/lib/authSession";

interface UserContextType {
  user: any;
  loading: boolean;
  refreshUser: (options?: { silent?: boolean }) => Promise<void>;
  updateUserLocally: (data: any) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

function isStudentSession(): boolean {
  const role = sessionStorage.getItem("userRole") || localStorage.getItem("userRole");
  return role === "STUDENT";
}

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(() =>
    isStudentSession() ? readDashboardCache(DASHBOARD_CACHE_KEYS.studentProfile) : null
  );
  const [loading, setLoading] = useState(() => {
    if (!isStudentSession()) return false;
    return !readDashboardCache(DASHBOARD_CACHE_KEYS.studentProfile);
  });

  const refreshUser = useCallback(async (options?: { silent?: boolean }) => {
    const silent = options?.silent ?? false;

    if (!isStudentSession()) {
      setLoading(false);
      setUser(null);
      return;
    }

    const hasCachedUser = !!readDashboardCache(DASHBOARD_CACHE_KEYS.studentProfile);

    try {
      if (!silent && !hasCachedUser) {
        setLoading(true);
      }
      const profile = await studentApi.getProfile();
      writeDashboardCache(DASHBOARD_CACHE_KEYS.studentProfile, profile);
      setUser(profile);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      if (!silent && !hasCachedUser) {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserLocally = useCallback((newData: any) => {
    setUser((prev: any) => {
      const merged = { ...prev, ...newData };
      writeDashboardCache(DASHBOARD_CACHE_KEYS.studentProfile, merged);
      return merged;
    });
  }, []);

  const logout = useCallback(() => {
    clearClientAuthState();
    clearAllDashboardCaches();
    setUser(null);
    window.location.href = "/login";
  }, []);

  useEffect(() => {
    const cached = readDashboardCache(DASHBOARD_CACHE_KEYS.studentProfile);
    refreshUser({ silent: !!cached });
  }, [refreshUser]);

  return (
    <UserContext.Provider value={{ user, loading, refreshUser, updateUserLocally, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
