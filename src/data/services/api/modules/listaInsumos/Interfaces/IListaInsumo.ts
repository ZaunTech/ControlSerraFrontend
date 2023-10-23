import { ICotacao } from "../../cotacao";
import { IInsumo } from "../../insumos/Interfaces/IInsumo"
import { IProduto } from "../../produtos";

export interface IListaInsumo {
    id: number;
    quantidade: number;
    idProduto: number;
    idInsumo: number;
    idCotacao?: number;
    produto: IProduto;
    insumo: IInsumo;
    cotacao?: ICotacao;
    createdAt: Date;
    updatedAt: Date;
}

