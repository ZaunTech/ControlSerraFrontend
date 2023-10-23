import { ICategoria } from "../../categorias/Interfaces/ICategoria";

export interface UpdateInsumoDto {
  titulo: string;
  descricao?: string;
  unidadeMedida?: string;
  idCategoria?: number;
  categoria?: ICategoria;
}
