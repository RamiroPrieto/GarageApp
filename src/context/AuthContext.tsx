import {
    createContext,
    useContext,
    useEffect,
    useState,
  } from "react";
  
  import {
    loadAuthToken,
    setAuthToken,
    clearAuthToken,
    apiFetch,
  } from "../api/api";
  
  type User = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    profileImage: string | null;
    emailVerified: boolean;
  };
  
  type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    loginWithGoogle: (idToken: string) => Promise<void>;
    logout: () => Promise<void>;
  };
  
  const AuthContext =
    createContext<AuthContextType | undefined>(
      undefined,
    );
  
  export function AuthProvider({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      restoreSession();
    }, []);
  
    const restoreSession = async () => {
      try {
        const token = await loadAuthToken();
  
        if (!token) {
          return;
        }
  
        const currentUser = await apiFetch(
          "/users/me",
        );
  
        setUser(currentUser);
      } catch (error) {
        console.log(
          "No se pudo restaurar la sesión",
          error,
        );
  
        await clearAuthToken();
      } finally {
        setIsLoading(false);
      }
    };
  
    const login = async (
      email: string,
      password: string,
    ) => {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });
  
      await setAuthToken(data.accessToken);
  
      const currentUser = await apiFetch(
        "/users/me",
      );
  
      setUser(currentUser);
    };
  
    const logout = async () => {
      await clearAuthToken();
      setUser(null);
    };

    const loginWithGoogle = async (idToken: string) => {
      const data = await apiFetch("/auth/google", { method: "POST", body: JSON.stringify({ idToken }) });
      await setAuthToken(data.accessToken);
      setUser(await apiFetch("/users/me"));
    };
  
    return (
      <AuthContext.Provider
        value={{
          user,
          isLoading,
          isAuthenticated: !!user,
          login,
          loginWithGoogle,
          logout,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
  
  export function useAuth() {
    const context = useContext(AuthContext);
  
    if (!context) {
      throw new Error(
        "useAuth debe utilizarse dentro de AuthProvider",
      );
    }
  
    return context;
  }
