import { IOrcamento } from "../../orcamentos";

export interface UpdateCategoriaDto {
    id: number;
    pagamento: number;
    status: status;
    idOrcamento: number;
    orcamentos: IOrcamento;
    createdAt: Date;
    updatedAt: Date; 
}
enum status 
{
    Pendente,
    Iniciado,
    Em_Processo, 
    Concluido
}