import { ICotacao } from "../../cotacoes";

import { IProduto } from "../../produtos";
import { IVariante } from "../../variantes";

export interface IListaInsumo {
    id: number;
    quantidade: number;
    idProduto: number;
    idVariante: number;
    idCotacao?: number;
   
    valorUnitario?: number;
    produto: IProduto;
    variante?: IVariante;
    cotacao?: ICotacao;
    createdAt: Date;
    updatedAt: Date;
}

