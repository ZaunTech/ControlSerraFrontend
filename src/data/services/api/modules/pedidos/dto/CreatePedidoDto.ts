export interface CreatePedidoDto {
  pagamento: number;
  status: status;
  idOrcamento: number;
}
enum status {
  Pendente,
  Iniciado,
  Em_Processo,
  Concluido,
}
