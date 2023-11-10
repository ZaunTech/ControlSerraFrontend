
import { IProdutoBase } from "../../produtosBase";
import { IVariante } from "../../variantes";

export interface IInsumosProdutoBase {
    id: number;
    quantidade?: number;
    idProdutoBase: number;
    idVariante: number;
    produtoBase?: IProdutoBase;
    unidade: string;
    variante?: IVariante;
    createdAt?: Date;
    updatedAt?: Date;
}

