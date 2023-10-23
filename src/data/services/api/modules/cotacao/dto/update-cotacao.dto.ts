export interface UpdateCotacaoDto {
    id: number;
    data: Date;
    valor?: number;
    idFornecedor: number;
    idInsumo: number;
    createdAt: Date;
    updatedAt: Date;
}
