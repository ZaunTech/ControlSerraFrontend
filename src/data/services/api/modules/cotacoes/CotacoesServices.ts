import { Api, IGetAll } from "../..";
import { Environment } from "../../../../environment";
import { ICotacao } from "./Interfaces/ICotacao";
import { TListCotacao } from "./Interfaces/TListCotacao";

const rota = "cotacoes";

const getAll = async (
  { page = 1,
    filter = "",
    perPage = Environment.LIMITE_DE_LINHAS }: Partial<IGetAll> = {},
      idInsumo?: number,
      idFornecedor?:number,
    ): Promise<TListCotacao | Error> => {
  try {
    const urlRelativa = `/${rota}?page=${page}&perPage=${perPage == 0 ? '' : perPage}&nome_like=${filter}&fornecedor=${idFornecedor}&insumo=${idInsumo}`;
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

const getByFornecdor = async (
  id: number,
  page = 1,
  filter = ""
): Promise<TListCotacao | Error> => {
  try {
    const urlRelativa = `/${rota}/findByFornecedor/${id}?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;
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

const getByInsumo = async (
  id: number,
  page = 1,
  filter = ""
): Promise<TListCotacao | Error> => {
  try {
    const urlRelativa = `/${rota}/findByInsumo/${id}?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;
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

const getById = async (id: number): Promise<ICotacao | Error> => {
  try {
    const urlRelativa = `/${rota}/${id}`;
    const response = await Api.get<ICotacao>(urlRelativa);
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
  dados: Omit<ICotacao, "id">
): Promise<ICotacao | Error> => {
  try {
    const urlRelativa = `/${rota}`;
    const response = await Api.post<ICotacao>(urlRelativa, dados);
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
const updateById = async (
  id: number,
  dados: ICotacao
): Promise<ICotacao | Error> => {
  try {
    const urlRelativa = `/${rota}/${id}`;
    const response = await Api.patch(urlRelativa, dados);
    if (response.statusText === "OK") {
      return response.data.id;
    }
    return new Error(Environment.ERRO_AO_LISTAR_DADOS);
  } catch (error) {
    return new Error(
      (error as { message: string }).message ||
      Environment.ERRO_AO_ACESSAR_DADOS
    );
  }
};
const deleteById = async (id: number): Promise<ICotacao | Error> => {
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

export const CotacoesService = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  getCount,
  getByInsumo,
  getByFornecdor,
};
