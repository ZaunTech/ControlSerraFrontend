import { ICliente } from "../../clientes";
import { IProduto } from "../../produtos";

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
  produtos: IProduto[];
  createdAt?: Date;
  updatedAt?: Date;
}

enum status {
  Pendente,
  Iniciado,
  Em_Processo,
  Concluido,
}
