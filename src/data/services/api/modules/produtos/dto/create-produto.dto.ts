
import { IOrcamento } from "../../orcamentos";

export interface CreateProdutoDto {
    id: number;
    titulo: string;
    quantidade?: number;
    valorUnitario?: number;
    observacoes: string;
    
    createdAt: Date;
    updatedAt: Date;
    Orcamento?: IOrcamento;
    orcamentoId: number;
}
