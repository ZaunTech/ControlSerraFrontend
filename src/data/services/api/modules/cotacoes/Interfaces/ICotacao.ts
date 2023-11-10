import { IFornecedor, IInsumo } from "../..";
import { IVariante } from "../../variantes";

export interface ICotacao {
  id: number;
  data: Date;
  valor: number;
  unidade: string;
  idFornecedor: number;
  fornecedor: IFornecedor;
  idVariante: number;
  variante: IVariante;
  createdAt: Date;
  updatedAt: Date;
}
