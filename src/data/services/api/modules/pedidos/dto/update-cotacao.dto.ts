import { IOrcamento } from "../../orcamentos";

export interface UpdateCategoriaDto {
   
    pagamento: number;
    status: status;
    idOrcamento: number;
    orcamentos: IOrcamento;
    
}
enum status 
{
    Pendente,
    Iniciado,
    Em_Processo, 
    Concluido
}