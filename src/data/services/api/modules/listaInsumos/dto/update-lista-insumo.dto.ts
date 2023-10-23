import { IInsumo } from "../../insumos";
import { IProduto } from "../../produtos";

export interface UpdateListaInsumosDto {
    id: number;
    quantidade: number;
    idProduto: number;
    idInsumo: number;
    idCotacao?: number;
    produto: IProduto;
    insumo: IInsumo;
    cotacao?: Cotacao;
    createdAt: Date;
    updatedAt: Date;
}
