import {
  Api,
  CreateProdutoBaseDto,
  IGetAll,
  IProdutoBase,
  TListProdutosBase,
  UpdateProdutoBaseDto,
} from "../..";
import { Environment } from "../../../../environment";

const rota = "produtos-base";

const getAll = async (
  { page = 1,
    filter = "",
    perPage = Environment.LIMITE_DE_LINHAS }: Partial<IGetAll> = {}
): Promise<TListProdutosBase | Error> => {
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
const getById = async (id: number): Promise<IProdutoBase | Error> => {
  try {
    const urlRelativa = `/${rota}/${id}`;
    const response = await Api.get<IProdutoBase>(urlRelativa);
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
  CreateProdutoBaseDto: CreateProdutoBaseDto
): Promise<IProdutoBase | Error> => {
  try {
    const urlRelativa = `/${rota}`;
    const response = await Api.post<IProdutoBase>(
      urlRelativa,
      CreateProdutoBaseDto
    );
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
  updateProdutoBaseDto: UpdateProdutoBaseDto
): Promise<IProdutoBase | Error> => {
  try {
    const urlRelativa = `/${rota}/${id}`;
    const response = await Api.patch(urlRelativa, updateProdutoBaseDto);
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
const deleteById = async (id: number): Promise<IProdutoBase | Error> => {
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

export const ProdutosBaseService = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  getCount,
};
