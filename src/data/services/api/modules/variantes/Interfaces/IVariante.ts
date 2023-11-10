import { IInsumo } from "../..";
import { ICategoria } from "../../categorias/Interfaces/ICategoria";

export interface IVariante {
  id: number;
  variante: string;
  idInsumo: number;
  insumo: IInsumo;
  createdAt: Date;
  updatedAt: Date;
}
