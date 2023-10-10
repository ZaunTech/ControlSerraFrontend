import { Api } from "..";
import { Environment } from "../../../environment";

interface ICliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
}

type TClientesComTotalCount = {
  data: ICliente[];
  totalCount: number;
};

const getAll = async (
  page = 1,
  filter = ""
): Promise<TClientesComTotalCount | Error> => {
  try {
    const urlRelativa = `/clientes?_page=${page}&_limite=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;
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
const getById = async (id: number): Promise<ICliente | Error> => {
  try {
    const urlRelativa = `/clientes/${id}`;
    const { data } = await Api.get<ICliente>(urlRelativa);
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
const create = async (dados: Omit<ICliente, "id">): Promise<number | Error> => {
  try {
    const urlRelativa = `/clientes`;
    const { data } = await Api.post<ICliente>(urlRelativa, dados);
    if (data) {
      return {
        data.id,
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
const updateById = async (id: number, dados: ICliente): Promise<void | Error> => {
  try {
    const urlRelativa = `/clientes/${id}`;
    await Api.put(urlRelativa, dados);
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
    const urlRelativa = `/clientes/${id}`;
    await Api.delete(urlRelativa);
    return new Error(Environment.ERRO_AO_LISTAR_DADOS);
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message ||
        Environment.ERRO_AO_ACESSAR_DADOS
    );
  }
};

export const ClientesService = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};
