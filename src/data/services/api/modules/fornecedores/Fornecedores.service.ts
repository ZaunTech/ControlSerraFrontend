import { Api } from "../..";
import { Environment } from "../../../../environment";
import { IFornecedor } from "./Interfaces/IFornecedor";
import { TListFornecedor } from "./Interfaces/TListFornecedor";
import { CreateFornecedorDto } from "./dto/create-fornecedor.dto";
import { UpdateFornecedorDto } from "./dto/update-fornecedor.dto";

const rota = "fornecedores";

const getAll = async (
  page = 1,
  filter = ""
): Promise<TListFornecedor | Error> => {
  try {
    const urlRelativa = `/${rota}?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;
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
const getById = async (id: number): Promise<IFornecedor | Error> => {
  try {
    const urlRelativa = `/${rota}/${id}`;
    const response = await Api.get<IFornecedor>(urlRelativa);
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
  createInsumoDto: CreateFornecedorDto
): Promise<IFornecedor | Error> => {
  try {
    const urlRelativa = `/${rota}`;
    const response = await Api.post<IFornecedor>(urlRelativa, createInsumoDto);
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
  updateInsumoaDto: UpdateFornecedorDto
): Promise<IFornecedor | Error> => {
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
const deleteById = async (id: number): Promise<IFornecedor | Error> => {
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

export const FornecedoresService = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  getCount,
};
