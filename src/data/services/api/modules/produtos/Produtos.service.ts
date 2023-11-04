import {
  AddProdutoBaseDto,
  CreateProdutoDto,
  IProduto,
  TListProdutos,
  UpdateProdutoDto,
} from ".";
import { Api, IProdutoBase } from "../..";
import { Environment } from "../../../../environment";

const rota = "produtos";

const getAll = async (
  page = 1,
  filter = ""
): Promise<TListProdutos | Error> => {
  try {
    const urlRelativa = `/${rota}?page=${page}&perPage=${Environment.LIMITE_DE_LINHAS}&titulo_like=${filter}`;
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
const getById = async (id: number): Promise<IProduto | Error> => {
  try {
    const urlRelativa = `/${rota}/${id}`;
    const response = await Api.get<IProduto>(urlRelativa);
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
  createProdutoDto: CreateProdutoDto
): Promise<IProduto | Error> => {
  try {
    const urlRelativa = `/${rota}`;
    const response = await Api.post<IProduto>(urlRelativa, createProdutoDto);
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
const addProdutoBase = async (
  addProdutoBase: AddProdutoBaseDto
): Promise<IProduto | Error> => {
  try {
    const urlRelativa = `/${rota}/addProdutoBase`;
    const response = await Api.post<IProduto>(urlRelativa, addProdutoBase);
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
  updateProdutoDto: UpdateProdutoDto
): Promise<IProduto | Error> => {
  try {
    const urlRelativa = `/${rota}/${id}`;
    const response = await Api.patch(urlRelativa, updateProdutoDto);
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
const deleteById = async (id: number): Promise<IProduto | Error> => {
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

export const ProdutosService = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  addProdutoBase,
  getCount,
};
