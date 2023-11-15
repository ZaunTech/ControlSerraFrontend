
import { IOrcamento } from "../../orcamentos";

export interface UpdateProdutoDto {
    
    titulo: string;
    quantidade?: number;
    valorUnitario?: number;
    observacoes: string;
    valorMaterial?:  number;
    valorMaoDeObra?: number;
    Orcamento?: IOrcamento;
    orcamentoId: number;
}
