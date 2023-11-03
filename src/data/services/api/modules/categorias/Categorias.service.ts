import { Api } from "../..";
import { Environment } from "../../../../environment";
import { ICategoria } from "./Interfaces/ICategoria";
import { TListCategorias } from "./Interfaces/TListCategoria";
import { CreateCategoriaDto } from "./dto/create-categoria.dto";
import { UpdateCategoriaDto } from "./dto/update-categoria.dto";

const rota = "categorias";

const getAll = async (
  page = 1,
  filter = ""
): Promise<TListCategorias | Error> => {
  try {
    
    const urlRelativa = `/${rota}?page=${page}&perPage=${Environment.LIMITE_DE_LINHAS}&titulo_like=${filter}`;
    const response = await Api.get(urlRelativa);
    const { data, headers } =  response;
    console.log(response);
    if (data) {
      return {
        data,
        totalCount: Number(
          headers['x-total-count'] || Environment.LIMITE_DE_LINHAS
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
const getById = async (id: number): Promise<ICategoria | Error> => {
  try {
    const urlRelativa = `/${rota}/${id}`;
    const { data } = await Api.get<ICategoria>(urlRelativa);
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
  createCategoriaDto: CreateCategoriaDto
): Promise<ICategoria | Error> => {
  try {
    const urlRelativa = `/${rota}`;
    const { data } = await Api.post<ICategoria>(
      urlRelativa,
      createCategoriaDto
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
  updateCategoriaDto: UpdateCategoriaDto
): Promise<ICategoria | Error> => {
  try {
    const urlRelativa = `/${rota}/${id}`;
    const response = await Api.patch(urlRelativa, updateCategoriaDto);
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
const deleteById = async (id: number): Promise<ICategoria | Error> => {
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

export const CategoriasService = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  getCount,
};
