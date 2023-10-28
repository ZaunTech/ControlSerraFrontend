export interface CreateCotacaoDto {
  data: Date;
  valor: number;
  idFornecedor: number;
  unidade: string;
  idInsumo: number;
}
