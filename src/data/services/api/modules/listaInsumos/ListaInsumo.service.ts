import { Api } from "../..";
import { Environment } from "../../../../environment";
import { IListaInsumo } from "./Interfaces/IListaInsumo";
import { TListListaInsumos } from "./Interfaces/TListListaInsumos";
import { CreateListaInsumosDto } from "./dto/create-lista-insumo.dto";
import { UpdateListaInsumosDto } from "./dto/update-lista-insumo.dto";

const rota = "pedidos";

const getAll = async (
  page = 1,
  filter = ""
): Promise<TListListaInsumos | Error> => {
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
    console.error(error);
    return new Error(
      (error as { message: string }).message ||
        Environment.ERRO_AO_ACESSAR_DADOS
    );
  }
};
const getById = async (id: number): Promise<IListaInsumo | Error> => {
  try {
    const urlRelativa = `/${rota}/${id}`;
    const { data } = await Api.get<IListaInsumo>(urlRelativa);
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
  createCategoriaDto: CreateListaInsumosDto
): Promise<number | Error> => {
  try {
    const urlRelativa = `/${rota}`;
    const { data } = await Api.post<IListaInsumo>(
      urlRelativa,
      createCategoriaDto
    );
    if (data) {
      return data.id;
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
): Promise<void | Error> => {
  try {
    const urlRelativa = `/${rota}/${id}`;
    const data = await Api.put(urlRelativa, updateCategoriaDto);
    if (data.statusText === "OK") {
      return data.data.id;
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
const deleteById = async (id: number): Promise<any> => {
  try {
    const urlRelativa = `/${rota}/${id}`;
    const data = await Api.delete(urlRelativa);
    if (data.statusText === "OK") {
      return data.data.id;
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
    const data = await Api.get(urlRelativa);
    if (data.statusText === "OK") {
      return data.data;
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

export const PedidosService = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  getCount,
};
