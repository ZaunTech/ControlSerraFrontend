import { ICliente } from "../../clientes";



export interface IOrcamento {
    id: number;
    validade?: Date;
    dataOrcamento: Date;
    totalMaoObra?: number;
    totalMateriais?: number;
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