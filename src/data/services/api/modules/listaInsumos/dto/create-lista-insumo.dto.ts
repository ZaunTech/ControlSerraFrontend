import { ICotacao } from "../../cotacoes";
import { IInsumo } from "../../insumos";
import { IProduto } from "../../produtos";

export interface CreateListaInsumosDto {
   
    quantidade: number;
    idProduto: number;
    idInsumo: number;
    idCotacao?: number;
    dimensoes?: string;
    produto: IProduto;
    insumo: IInsumo;
    cotacao?: ICotacao;
    
}
