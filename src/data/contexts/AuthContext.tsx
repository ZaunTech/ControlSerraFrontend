import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AuthService } from "../services/api";

interface IAuthContext {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<string | void>;
  logout: () => void;
}

const AuthContext = createContext({} as IAuthContext);

interface IAuthProvider {
  children: React.ReactNode;
}

const LOCAL_STORAGE_STORAGE_KEY__ACCESS_TOKEN = "APP_ACCESS_TOKEN";

const GetToken = () => {
  let token = localStorage.getItem("APP_ACCESS_TOKEN");

  if (token !== "undefined") {
    try {
      // Tenta fazer o parse apenas se o token existir
      token = JSON.parse(token);
      return token;
    } catch (error) {
      console.error("Erro ao fazer parse do token:", error);
      return null;
    }
  } else {
    console.error("O token não está presente no localStorage.");
    return null;
  }
};

export const AuthProvider: React.FC<IAuthProvider> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string>();

  useEffect(() => {
    const token = GetToken();
    setAccessToken(token);
    return;
  }, []);

  const handleLogin = useCallback(async (email: string, password: string) => {
    const result = await AuthService.auth(email, password);
    console.log("Result no handle", result);
    console.log("Accesssss tokenenennene", result.access_token);
    if (result instanceof Error) {
      return result.message;
    }
    localStorage.setItem(
      LOCAL_STORAGE_STORAGE_KEY__ACCESS_TOKEN,
      JSON.stringify(result.accessToken)
    );
    setAccessToken(result.accessToken);
    return accessToken;
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_STORAGE_KEY__ACCESS_TOKEN);
    setAccessToken(undefined);
  }, []);

  const isAuthenticated = useMemo(() => !!accessToken, [accessToken]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login: handleLogin, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
