export interface CreateProdutoBaseDto {
    id: number;
    titulo: string;
    valorUnitario?: number;
    observacoes?: string;
   
    createdAt: Date;
    updatedAt: Date;
}
