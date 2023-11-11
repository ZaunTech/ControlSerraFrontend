
import { IProdutoBase } from "../../produtosBase";
import { IVariante } from "../../variantes";

export interface IInsumosProdutoBase {
    id: number;
    quantidade?: number;
    idProdutoBase: number;
    idVariante: number;
    produtoBase?: IProdutoBase;
    
    variante?: IVariante;
    createdAt?: Date;
    updatedAt?: Date;
}

