import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AuthService, IUsuario } from "../services/api";

interface IAuthContext {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<string | void>;
  logout: () => void;
  usuario: IUsuario | undefined;
}

const AuthContext = createContext({} as IAuthContext);

interface IAuthProvider {
  children: React.ReactNode;
}

const LOCAL_STORAGE_STORAGE_KEY__ACCESS_TOKEN = "APP_ACCESS_TOKEN";
const LOCAL_STORAGE_STORAGE_KEY__USER = "APP_USER";

const GetToken = () => {
  let token = localStorage.getItem("APP_ACCESS_TOKEN");

  if (token !== "undefined") {
    try {
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
  const [usuario, setUsuario] = useState<IUsuario | undefined>();

  useEffect(() => {
    const token = GetToken();
    setAccessToken(token);
    const user = localStorage.getItem(LOCAL_STORAGE_STORAGE_KEY__USER);
    if (user) {
      try {
        setUsuario(JSON.parse(user));
      } catch (error) {
        console.error("Erro ao fazer parse do usuário:", error);
      }
    }
    return;
  }, []);

  const handleLogin = useCallback(async (email: string, password: string) => {
    const result = await AuthService.auth(email, password);
    if (result instanceof Error) {
      return result.message;
    }
    localStorage.setItem(
      LOCAL_STORAGE_STORAGE_KEY__ACCESS_TOKEN,
      JSON.stringify(result.accessToken)
    );

    localStorage.setItem(
      LOCAL_STORAGE_STORAGE_KEY__USER,
      JSON.stringify(result.usuario)
    );

    setAccessToken(result.accessToken);
    setUsuario(result.usuario);

    return accessToken;
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_STORAGE_KEY__ACCESS_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_STORAGE_KEY__USER);
    setAccessToken(undefined);
    setUsuario(undefined);
  }, []);

  const isAuthenticated = useMemo(() => !!accessToken, [accessToken]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        usuario,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
