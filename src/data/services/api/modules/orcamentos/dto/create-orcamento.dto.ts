import { ICliente } from "../..";


export interface CreateOrcamentoDto {
    id: Number;
    validade?: Date;
    dataOrcamento: Date;
    totalMaoObra?: number;
    totalMateriais?: number;
    valorPago?: number;
    status: status;
    prazoEstimadoProducao: number;
    observacoes?: string;
    idCliente: number;
    idPedido?: number;
    cliente: ICliente;
    createdAt?: Date;
    updatedAt?: Date;
   
}

enum status {
    Pendente,
    Iniciado,
    Em_Processo ,
    Concluido
  }