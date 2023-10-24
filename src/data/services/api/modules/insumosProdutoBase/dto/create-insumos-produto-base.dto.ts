import { IInsumo } from "../../insumos";
import { IProdutoBase } from "../../produtosBase";

export interface CreateInsumosProdutoBaseDto {
  quantidade?: number;
  idProdutoBase: number;
  idInsumo: number;
  dimensoes: string;
  produtoBase: IProdutoBase;
  insumo: IInsumo;
}
