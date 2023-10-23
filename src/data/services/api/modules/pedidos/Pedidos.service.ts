import { CreatePedidoDto, IPedido, TListPedidos, UpdatePedidoDto } from ".";
import { Api } from "../..";
import { Environment } from "../../../../environment";

const rota = "pedidos";

const getAll = async (page = 1, filter = ""): Promise<TListPedidos | Error> => {
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
const getById = async (id: number): Promise<IPedido | Error> => {
  try {
    const urlRelativa = `/${rota}/${id}`;
    const response = await Api.get<IPedido>(urlRelativa);
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
  createPedidoDto: CreatePedidoDto
): Promise<IPedido | Error> => {
  try {
    const urlRelativa = `/${rota}`;
    const response = await Api.post<IPedido>(urlRelativa, createPedidoDto);
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
  updatePedidoDto: UpdatePedidoDto
): Promise<IPedido | Error> => {
  try {
    const urlRelativa = `/${rota}/${id}`;
    const response = await Api.patch(urlRelativa, updatePedidoDto);
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
const deleteById = async (id: number): Promise<IPedido | Error> => {
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

export const PedidosService = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  getCount,
};
