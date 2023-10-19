import { Api } from "../..";
import { Environment } from "../../../../environment";
import { ICategoria, TListCategorias } from "./ICategoria";
import { CreateCategoriaDto } from "./dto/create-categoria.dto";
import { UpdateCategoriaDto } from "./dto/update-categoria.dto";

const rota = 'categorias';

const getAll = async (
    page = 1,
    filter = ""
): Promise<TListCategorias | Error> => {
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
        console.error(error);
        return new Error(
            (error as { message: string }).message ||
            Environment.ERRO_AO_ACESSAR_DADOS
        );
    }
};
const getById = async (id: number): Promise<ICategoria | Error> => {
    try {
        const urlRelativa = `/${rota}/${id}`;
        const { data } = await Api.get<ICategoria>(urlRelativa);
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
const create = async (createCategoriaDto: CreateCategoriaDto): Promise<number | Error> => {
    try {
        const urlRelativa = `/${rota}`;
        const { data } = await Api.post<ICategoria>(urlRelativa, createCategoriaDto);
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

export const CategoriasService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
};
