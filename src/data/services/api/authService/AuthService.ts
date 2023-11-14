import { Api } from "..";

interface IAuth {
  accessToken: string;
}

const auth = async (
  email: string,
  password: string
): Promise<IAuth | Error> => {
  const response = await Api.post("/login", { email, password });
  const { data } = response;
  if (data) {
    return data;
  }
  return new Error("Erro ao efetuar o login");
};

export const AuthService = {
  auth,
};
