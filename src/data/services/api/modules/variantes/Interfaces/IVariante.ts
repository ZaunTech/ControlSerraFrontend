import { ICategoria } from "../../categorias/Interfaces/ICategoria";

export interface IVariante {
  id: number;
  titulo: string;
  descricao?: string;
  unidadeMedida?: string;
  idCategoria?: number;
  categoria?: ICategoria;
  createdAt: Date;
  updatedAt: Date;
}
