import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface User {
  id: string;
  username: string;
  role: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { data: verifyData, isLoading: isVerifying } = useQuery({
    queryKey: ["/api/auth/verify"],
    queryFn: async () => {
      const token = localStorage.getItem("vigon_token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await apiRequest("POST", "/api/auth/verify", { token });
      return await response.json();
    },
    retry: false,
    enabled: !!localStorage.getItem("vigon_token"),
  });

  useEffect(() => {
    const token = localStorage.getItem("vigon_token");
    const storedUser = localStorage.getItem("vigon_user");
    

    
    if (!token) {
      setIsLoading(false);
      return;
    }

    // Try to load user from localStorage first for immediate feedback
    if (storedUser && !user) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (e) {
        console.error("Failed to parse stored user data:", e);
      }
    }

    if (verifyData?.user) {
      setUser(verifyData.user);
    }
    
    setIsLoading(isVerifying);
  }, [verifyData, isVerifying, user]);

  const logout = () => {
    localStorage.removeItem("vigon_token");
    localStorage.removeItem("vigon_user");
    setUser(null);
    window.location.href = "/";
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}