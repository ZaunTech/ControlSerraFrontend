import { IInsumo } from "../../insumos/Interfaces/IInsumo"

export interface ICotcacao {
    id: number
    tipo: string
    titulo: string
    descricao?: string
    insumos?: IInsumo[]
    createdAt?: Date
    updatedAt?: Date
}

enum status 
{
    Pendente,
    Iniciado,
    Em_Processo, 
    Concluido
}