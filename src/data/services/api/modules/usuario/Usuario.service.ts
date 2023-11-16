import { Api, IGetAll } from "../..";
import { Environment } from "../../../../environment";
import { IChangePassword } from "./Interfaces/IChangePassword";
import { IUsuario } from "./Interfaces/IUsuario";
import { TListUsuarios } from "./Interfaces/TListUsuario";
import { CreateUsuarioDto } from "./dto/create-usuario.dto";
import { UpdateUsuarioDto } from "./dto/update-usuario.dto";

const rota = "usuarios";

const getAll = async (
  { page = 1,
    filter = "",
    perPage = Environment.LIMITE_DE_LINHAS }: Partial<IGetAll> = {}
): Promise<TListUsuarios | Error> => {
  try {
    const urlRelativa = `/${rota}?page=${page}&perPage=${perPage == 0 ? '' : perPage}&titulo_like=${filter}`;
    const { data, headers } = await Api.get(urlRelativa);
    if (data) {
      return {
        data,
        totalCount: Number(
          headers["x-total-count"] || Environment.LIMITE_DE_LINHAS
        ),
      };
    }
    return new Error(Environment.ERRO_AO_LISTAR_DADOS);
  } catch (error) {
    return new Error(
      (error as { message: string }).message ||
      Environment.ERRO_AO_ACESSAR_DADOS
    );
  }
};
const getById = async (id: number): Promise<IUsuario | Error> => {
  try {
  console.log(id)
    const urlRelativa = `/${rota}/${id}`;
    const { data } = await Api.get<IUsuario>(urlRelativa);
    if (data) {
      return data;
    }
    return new Error(Environment.ERRO_AO_LISTAR_DADOS);
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message ||
      Environment.ERRO_AO_ACESSAR_DADOS
    );
  }
};
const create = async (
  createUsuarioDto: CreateUsuarioDto
): Promise<IUsuario | Error> => {
  
  try {
    const urlRelativa = `/${rota}`;
    const { data } = await Api.post<IUsuario>(
      urlRelativa,
      createUsuarioDto
    );
    if (data) {
      return data;
    }
    return new Error(Environment.ERRO_AO_LISTAR_DADOS);
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message ||
      Environment.ERRO_AO_ACESSAR_DADOS
    );
  }
};
const updateById = async (
  id: number,
  updateUsuarioDto: UpdateUsuarioDto
): Promise<IUsuario | Error> => {
  try {
    const urlRelativa = `/${rota}/${id}`;
    const response = await Api.patch(urlRelativa, updateUsuarioDto);
    if (response.statusText === "OK") {
      return response.data;
    }
    return new Error(Environment.ERRO_AO_LISTAR_DADOS);
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message ||
      Environment.ERRO_AO_ACESSAR_DADOS
    );
  }
};
const deleteById = async (id: number): Promise<IUsuario | Error> => {
  try {
    const urlRelativa = `/${rota}/${id}`;
    const response = await Api.delete(urlRelativa);
    if (response.statusText === "OK") {
      return response.data;
    }
    return new Error(Environment.ERRO_AO_LISTAR_DADOS);
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message ||
      Environment.ERRO_AO_ACESSAR_DADOS
    );
  }
};

const getCount = async (): Promise<number | Error> => {
  try {
    const urlRelativa = `/${rota}/count`;
    const response = await Api.get(urlRelativa);
    if (response.statusText === "OK") {
      return response.data;
    }
    return new Error(Environment.ERRO_AO_LISTAR_DADOS);
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message ||
      Environment.ERRO_AO_ACESSAR_DADOS
    );
  }
};

const alterarSenha = async (
  id: number,
  data: IChangePassword
): Promise<IUsuario | Error> => {
  try {
    const urlRelativa = `/${rota}/${id}`;
    const response = await Api.post(urlRelativa, data); 
    if (response.statusText === "OK") {
      return response.data;
    }
    return new Error(Environment.ERRO_AO_LISTAR_DADOS);
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message ||
      Environment.ERRO_AO_ACESSAR_DADOS
    );
  }
};

export const UsuariosService = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  getCount,
  alterarSenha,
};
