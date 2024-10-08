import { CreateVarianteDto, IVariante, TListVariantes, UpdateVarianteDto } from ".";
import { Api, IGetAll } from "../..";
import { Environment } from "../../../../environment";


const rota = "variantes";

const getAll = async (
  { page = 1,
    filter = "",
    perPage = Environment.LIMITE_DE_LINHAS }: Partial<IGetAll> = {},
   ): Promise<TListVariantes | Error> => {
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
const getAllId = async (
  { page = 1,
    filter = "",
    perPage = Environment.LIMITE_DE_LINHAS }: Partial<IGetAll> = {},
    idInsumo: number): Promise<TListVariantes | Error> => {
  try {
    const urlRelativa = `/${rota}/insumo/${idInsumo}?page=${page}&perPage=${perPage == 0 ? '' : perPage}&titulo_like=${filter}`;
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
const getById = async (id: number): Promise<IVariante | Error> => {
  try {
    const urlRelativa = `/${rota}/${id}`;
    const response = await Api.get<IVariante>(urlRelativa);
    if (response) {
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
const create = async (
  createVarianteDto: CreateVarianteDto
): Promise<IVariante | Error> => {
  try {
    const urlRelativa = `/${rota}`;
    const response = await Api.post<IVariante>(urlRelativa, createVarianteDto);
    if (response) {
      return response.data;
    }
    return new Error(Environment.ERRO_AO_LISTAR_DADOS);
  } catch (error) {
    return new Error(
      (error as { message: string }).message ||
      Environment.ERRO_AO_ACESSAR_DADOS
    );
  }
};
const updateById = async (
  id: number,
  updateInsumoaDto: UpdateVarianteDto
): Promise<IVariante | Error> => {
  try {
    const urlRelativa = `/${rota}/${id}`;
    const response = await Api.patch(urlRelativa, updateInsumoaDto);
    if (response.statusText === "OK") {
      return response.data;
    }
    return new Error(Environment.ERRO_AO_LISTAR_DADOS);
  } catch (error) {
    return new Error(
      (error as { message: string }).message ||
      Environment.ERRO_AO_ACESSAR_DADOS
    );
  }
};
const deleteById = async (id: number): Promise<IVariante | Error> => {
  try {
    const urlRelativa = `/${rota}/${id}`;
    const response = await Api.delete(urlRelativa);
    if (response.statusText === "OK") {
      return response.data;
    }
    return new Error(Environment.ERRO_AO_LISTAR_DADOS);
  } catch (error) {
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
    return new Error(
      (error as { message: string }).message ||
      Environment.ERRO_AO_ACESSAR_DADOS
    );
  }
};

export const  VariantesService = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  getCount,
  getAllId,
};
