import { IFornecedor, IInsumo } from "../..";

export interface ICotacao {
  id: number;
  data: Date;
  valor: number;
  dimensoes: string;
  idFornecedor: number;
  fornecedor: IFornecedor;
  idInsumo: number;
  insumo: IInsumo;
  createdAt: Date;
  updatedAt: Date;
}
