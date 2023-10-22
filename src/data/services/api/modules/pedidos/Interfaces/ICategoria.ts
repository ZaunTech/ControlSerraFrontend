import { IInsumo } from "../../insumos/Interfaces/IInsumo"

export interface ICategoria {
    id: number
    tipo: string
    titulo: string
    descricao?: string
    insumos?: IInsumo[]
    createdAt?: Date
    updatedAt?: Date
}

