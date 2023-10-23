
import { IOrcamento } from "../../orcamentos";

export interface CreateProdutoDto {
 
    titulo: string;
    quantidade?: number;
    valorUnitario?: number;
    observacoes: string;
    Orcamento?: IOrcamento;
    orcamentoId: number;
}
