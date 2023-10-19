import { ICategoria } from "../../categorias/ICategoria";

export interface CreateInsumoDto {
    titulo: string;
    descricao?: string;
    unidadeMedida?: string;
    idCategoria?: number;
    categoria?: ICategoria;
}
