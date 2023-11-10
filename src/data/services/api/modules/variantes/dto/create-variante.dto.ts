import { ICategoria } from "../../categorias/Interfaces/ICategoria";

export interface CreateVarianteDto {
    titulo: string;
    descricao?: string;
    unidadeMedida?: string;
    idCategoria?: number;
    categoria?: ICategoria;
}
