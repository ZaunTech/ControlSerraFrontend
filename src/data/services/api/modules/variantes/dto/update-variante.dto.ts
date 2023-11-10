import { ICategoria } from "../../categorias/Interfaces/ICategoria";

export interface UpdateVarianteDto {
  titulo: string;
  descricao?: string;
  unidadeMedida?: string;
  idCategoria?: number;
  categoria?: ICategoria;
}
