import {
  CreateInsumosProdutoBaseDto,
  IInsumosProdutoBase,
  TListInsumosProdutoBase,
  UpdateInsumosProdutoBaseDto,
} from ".";
import { Api } from "../..";
import { Environment } from "../../../../environment";

const rota = "insumos-produtos-base";

const getAll = async (
  page = 1,
  filter = ""
): Promise<TListInsumosProdutoBase | Error> => {
  try {
    const urlRelativa = `/${rota}?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&titulo_like=${filter}`;
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
const getById = async (id: number): Promise<IInsumosProdutoBase | Error> => {
  try {
    const urlRelativa = `/${rota}/${id}`;
    const response = await Api.get<IInsumosProdutoBase>(urlRelativa);
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
const create = async (
  createInsumosProdutoBaseDto: CreateInsumosProdutoBaseDto
): Promise<IInsumosProdutoBase | Error> => {
  try {
    const urlRelativa = `/${rota}`;
    const { data: response } = await Api.post<IInsumosProdutoBase>(
      urlRelativa,
      createInsumosProdutoBaseDto
    );
    if (response) {
      return response;
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
  updateInsumosProdutoBaseDto: UpdateInsumosProdutoBaseDto
): Promise<IInsumosProdutoBase | Error> => {
  try {
    const urlRelativa = `/${rota}/${id}`;
    const response = await Api.put(urlRelativa, updateInsumosProdutoBaseDto);
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
const deleteById = async (id: number): Promise<IInsumosProdutoBase | Error> => {
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

export const InsumosProdutoBaseService = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  getCount,
};
