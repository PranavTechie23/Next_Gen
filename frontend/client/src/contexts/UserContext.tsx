import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { studentApi } from "@/services/studentApi";
import { toast } from "sonner";

interface UserContextType {
  user: any;
  loading: boolean;
  refreshUser: () => Promise<void>;
  updateUserLocally: (data: any) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "STUDENT") {
      setLoading(false);
      setUser(null);
      return;
    }

    try {
      setLoading(true);
      const profile = await studentApi.getProfile();
      setUser(profile);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      // Don't toast error on mount as it might just be an expired session
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserLocally = useCallback((newData: any) => {
    setUser((prev: any) => ({ ...prev, ...newData }));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authToken");
    setUser(null);
    window.location.href = "/login";
  }, []);

  useEffect(() => {
    refreshUser();
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
