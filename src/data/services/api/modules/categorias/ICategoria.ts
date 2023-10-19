import { IInsumo } from "../insumos/IInsumo"

export interface ICategoria {
    id: number
    tipo: string
    titulo: string
    descricao?: string
    insumos?: IInsumo[]
    createdAt?: Date
    updatedAt?: Date
}

export type TListCategorias = {
    data: ICategoria[];
    totalCount: number;
}