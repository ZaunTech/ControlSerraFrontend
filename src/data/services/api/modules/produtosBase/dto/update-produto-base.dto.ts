export interface UpdateProdutoBaseDto {
    tid: number;
    titulo: string;
    valorUnitario?: number;
    observacoes?: string;
    
    createdAt: Date;
    updatedAt: Date;
}
