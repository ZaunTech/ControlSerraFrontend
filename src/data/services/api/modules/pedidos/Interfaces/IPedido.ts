import { IOrcamento } from "../../orcamentos";

export interface IPedido {
  id: number;
  tipo: string;
  titulo: string;
  descricao?: string;
  orcamento: IOrcamento;
  status: status;
  createdAt?: Date;
  updatedAt?: Date;
}

enum status {
  Pendente,
  Iniciado,
  Em_Processo,
  Concluido,
}
