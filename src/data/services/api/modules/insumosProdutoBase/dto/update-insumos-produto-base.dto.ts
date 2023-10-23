import { IInsumo } from "../../insumos";
import { IProdutoBase } from "../../produtosBase";

export interface UpdateInsumosProdutoBaseDto {
   
    quantidade?: number;
    idProdutoBase: number;
    idInsumo: number;
    produtoBase: IProdutoBase;
    insumo: IInsumo;

}
