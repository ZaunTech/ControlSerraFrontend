import { ICategoria } from "../categorias/ICategoria";

export interface IInsumo {
    id: number;
    titulo: string;
    descricao?: string;
    unidadeMedida?: string;
    idCategoria?: number;
    categoria?: ICategoria;
    createdAt?: Date;
    updatedAt?: Date;
}

export type TListInsumos = {
    data: IInsumo[];
    totalCount: number;
}
