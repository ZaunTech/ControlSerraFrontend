import { Api } from "../..";
import { Environment } from "../../../../environment";
import { IInsumo } from "./Interfaces/IInsumo";
import { TListInsumos } from "./Interfaces/TListInsumo";
import { CreateInsumoDto } from "./dto/create-insumo.dto";
import { UpdateInsumoDto } from "./dto/update-insumo.dto";

const rota = "insumos";

const getAll = async (page = 1, filter = ""): Promise<TListInsumos | Error> => {
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
const getById = async (id: number): Promise<IInsumo | Error> => {
  try {
    const urlRelativa = `/${rota}/${id}`;
    const response = await Api.get<IInsumo>(urlRelativa);
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
  createInsumoDto: CreateInsumoDto
): Promise<IInsumo | Error> => {
  try {
    const urlRelativa = `/${rota}`;
    const response = await Api.post<IInsumo>(urlRelativa, createInsumoDto);
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
  updateInsumoaDto: UpdateInsumoDto
): Promise<IInsumo | Error> => {
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
const deleteById = async (id: number): Promise<IInsumo | Error> => {
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

export const InsumosService = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  getCount,
};
