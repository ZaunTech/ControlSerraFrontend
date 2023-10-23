import { Api } from "../..";
import { Environment } from "../../../../environment";
import { IInsumo } from "./Interfaces/IInsumo";
import { TListInsumos } from "./Interfaces/TListInsumo";
import { CreateInsumoDto } from "./dto/create-insumo.dto";
import { UpdateInsumoDto } from "./dto/update-insumo.dto";

const rota = "insumos";

const getAll = async (page = 1, filter = ""): Promise<TListInsumos | Error> => {
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
const getById = async (id: number): Promise<IInsumo | Error> => {
  try {
    const urlRelativa = `/${rota}/${id}`;
    const { data } = await Api.get<IInsumo>(urlRelativa);
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
  createInsumoDto: CreateInsumoDto
): Promise<number | Error> => {
  try {
    const urlRelativa = `/${rota}`;
    const { data } = await Api.post<IInsumo>(urlRelativa, createInsumoDto);
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
  updateInsumoaDto: UpdateInsumoDto
): Promise<void | Error> => {
  try {
    const urlRelativa = `/${rota}/${id}`;
    const data = await Api.put(urlRelativa, updateInsumoaDto);
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

export const InsumosService = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  getCount,
};
