import {
  TListListaInsumos,
  CreateListaInsumosDto,
  UpdateListaInsumosDto,
  IListaInsumo,
} from ".";
import { Api, IGetAll } from "../..";
import { Environment } from "../../../../environment";

const rota = "lista-insumos";

const getAll = async (
  { page = 1,
    filter = "",
    perPage = Environment.LIMITE_DE_LINHAS }: Partial<IGetAll> = {}
): Promise<TListListaInsumos | Error> => {
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
const getById = async (id: number): Promise<IListaInsumo | Error> => {
  try {
    const urlRelativa = `/${rota}/${id}`;
    const response = await Api.get<IListaInsumo>(urlRelativa);
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

const getListaByIdProduto = async (
  { page = 1,
    filter = "",
    perPage = Environment.LIMITE_DE_LINHAS }: Partial<IGetAll> = {},
    id:number
  
): Promise<TListListaInsumos | Error> => {
  
  try {
    const urlRelativa = `/${rota}/produtos/${id}?page=${page}&perPage=${perPage == 0 ? '' : perPage}&titulo_like=${filter}`;
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

const create = async (
  createListaInsumosDto: CreateListaInsumosDto
): Promise<IListaInsumo | Error> => {
  try {
    const urlRelativa = `/${rota}`;
    const response = await Api.post<IListaInsumo>(
      urlRelativa,
      createListaInsumosDto
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
  updateListaInsumosDto: UpdateListaInsumosDto
): Promise<IListaInsumo | Error> => {
  try {
    const urlRelativa = `/${rota}/${id}`;
    const response = await Api.patch(urlRelativa, updateListaInsumosDto);
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
const deleteById = async (id: number): Promise<IListaInsumo | Error> => {
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
    console.error(error);
    return new Error(
      (error as { message: string }).message ||
        Environment.ERRO_AO_ACESSAR_DADOS
    );
  }
};

interface IDataSetCotacacao {
  idCotacao: number;
}

interface IParamsSetCotacao {
  idItemListaInsumo: number;
  idCotacao: number;
}

const setCotacao = async (
  paramsSetCotaco: IParamsSetCotacao
): Promise<IParamsSetCotacao | Error> => {
  try {


    const urlRelativa = `/${rota}/${paramsSetCotaco.idItemListaInsumo}/cotar`;
    const response = await Api.post<IParamsSetCotacao>(urlRelativa, {
      idCotacao: paramsSetCotaco.idCotacao,
    });
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

export const ListaInsumosService = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  getCount,
  getListaByIdProduto,
  setCotacao,
};
