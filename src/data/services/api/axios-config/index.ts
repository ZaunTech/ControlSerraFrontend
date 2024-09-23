import axios from "axios";
import { errorInterceptor, responseInterceptor } from "./interceptors";
const VITE_API_URL = import.meta.env.VITE_API_URL

const GetToken = () => {
  let token = localStorage.getItem("APP_ACCESS_TOKEN");

  if (token) {
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

const Api = axios.create({
  baseURL: VITE_API_URL,
  headers: {
    Authorization: `Bearer ${GetToken()}`,
  },
});

Api.interceptors.response.use(
  (response) => responseInterceptor(response),
  (error) => errorInterceptor(error)
);

export { Api };
