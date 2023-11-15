import { IOrcamento } from "../../orcamentos";

export interface IProduto {
  id: number;
  tipo: string;
  titulo: string;
  observacoes?: string;
  valorMaterial?:  number;
  valorMaoDeObra?: number;
  quantidade: number;
  valorUnitario: number;
  idOrcamento: string;
  orcamento: IOrcamento;
  createdAt?: Date;
  updatedAt?: Date;
}
