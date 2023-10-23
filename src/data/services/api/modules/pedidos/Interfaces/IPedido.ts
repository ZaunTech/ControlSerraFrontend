export interface IPedido {
  id: number;
  tipo: string;
  titulo: string;
  descricao?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

enum status {
  Pendente,
  Iniciado,
  Em_Processo,
  Concluido,
}
