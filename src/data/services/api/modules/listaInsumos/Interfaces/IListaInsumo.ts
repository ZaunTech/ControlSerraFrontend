import { ICotacao } from "../../cotacoes";
import { IInsumo } from "../../insumos/Interfaces/IInsumo"
import { IProduto } from "../../produtos";

export interface IListaInsumo {
    id: number;
    quantidade: number;
    idProduto: number;
    idInsumo: number;
    idCotacao?: number;
    unidade: string;
    valorUnitario?: number;
    produto: IProduto;
    insumo: IInsumo;
    cotacao?: ICotacao;
    createdAt: Date;
    updatedAt: Date;
}

