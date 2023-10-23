import {  IInsumo } from "../../insumos/Interfaces/IInsumo"
import { IProdutoBase } from "../../produtosBase";

export interface IInsumosProdutoBase {
    id: number;
    quantidade?: number;
    idProdutoBase: number;
    idInsumo: number;
    produtoBase: IProdutoBase;
    insumo: IInsumo;
    createdAt: Date;
    updatedAt: Date;
}

