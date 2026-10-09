import {
    createContext,
    useContext,
    useCallback,
    useEffect,
    useRef,
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
    creditBalance: number;
  };
  
  type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    loginWithGoogle: (idToken: string) => Promise<void>;
    refreshUser: () => Promise<User>;
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
    const sessionVersion = useRef(0);
  
    useEffect(() => {
      restoreSession();
    }, []);
  
    const restoreSession = async () => {
      const versionWhenRestoring = sessionVersion.current;

      try {
        const token = await loadAuthToken();

        if (!token || versionWhenRestoring !== sessionVersion.current) {
          return;
        }
  
        const currentUser = await apiFetch(
          "/users/me",
        );
  
        if (versionWhenRestoring === sessionVersion.current) {
          setUser(currentUser);
        }
      } catch (error) {
        console.log(
          "No se pudo restaurar la sesión",
          error,
        );
  
        if (versionWhenRestoring === sessionVersion.current) {
          await clearAuthToken();
        }
      } finally {
        if (versionWhenRestoring === sessionVersion.current) {
          setIsLoading(false);
        }
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
      sessionVersion.current += 1;
      setUser(null);
      await clearAuthToken();
    };

    // Home uses this in a focus effect. Keeping its identity stable prevents a
    // refreshUser -> setUser -> Provider render -> focus effect loop.
    const refreshUser = useCallback(async () => {
      const currentUser: User = await apiFetch('/users/me');
      setUser(currentUser);
      return currentUser;
    }, []);

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
          refreshUser,
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
