import { ICotacao } from "../../cotacoes";
import { IInsumo } from "../../insumos";
import { IProduto } from "../../produtos";

export interface UpdateListaInsumosDto {

    quantidade: number;
    idProduto: number;
    idInsumo: number;
    idCotacao?: number;
    produto: IProduto;
    insumo: IInsumo;
    cotacao?: ICotacao;

}
