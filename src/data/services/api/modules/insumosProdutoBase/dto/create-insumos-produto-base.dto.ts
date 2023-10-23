import { IInsumo } from "../../insumos";
import { IProdutoBase } from "../../produtosBase";

export interface CreateInsumosProdutoBaseDto {
    id: number;
    quantidade?: number;
    idProdutoBase: number;
    idInsumo: number;
    produtoBase: IProdutoBase;
    insumo: IInsumo;
    createdAt: Date;
    updatedAt: Date;
}
