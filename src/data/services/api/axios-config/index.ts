import axios from "axios";
import { errorInterceptor, responseInterceptor } from "./interceptors";
import { Environment } from "../../../environment";

const GetToken = () => {
  let token = localStorage.getItem("APP_ACCESS_TOKEN");

  if (token) {
    try {
      // Tenta fazer o parse apenas se o token existir
      console.log("Token no axios", token);
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

const Api = axios.create({
  baseURL: Environment.URL_BASE,
  headers: {
    Authorization: `Bearer ${GetToken()}`,
  },
});

Api.interceptors.response.use(
  (response) => responseInterceptor(response),
  (error) => errorInterceptor(error)
);

export { Api };
