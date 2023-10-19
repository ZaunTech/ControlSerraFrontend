import { Api } from "..";

interface IAuth {
  accessToken: string;
}

const auth = async (
  email: string,
  password: string
): Promise<IAuth | Error> => {
  try {
    const { data } = await Api.get("/auth", { data: { email, password } }); //Metodo get apenas para teste, pois nao foi implementado autenticação no mock do json server
    if (data) {
      return data;
    }
    return new Error("Erro ao efetuar o login");
  } catch (error) {
    return new Error(
      (error as { message: string }).message || "Erro ao efetuar o login"
    );
  }
};

export const AuthService = {
  auth,
};
