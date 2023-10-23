
import { IOrcamento } from "../../orcamentos";

export interface UpdateProdutoDto {
    
    titulo: string;
    quantidade?: number;
    valorUnitario?: number;
    observacoes: string;
    Orcamento?: IOrcamento;
    orcamentoId: number;
}
