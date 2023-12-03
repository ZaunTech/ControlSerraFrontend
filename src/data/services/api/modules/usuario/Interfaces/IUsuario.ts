export interface IUsuario {
  id: number;
  tipoUsuario: tipoUsuario;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  senha: string;
  token: string;
  createdAt: Date;
  updatedAt: Date;
}
export enum tipoUsuario {
  Serralheiro,
  Administrador,
  Vendedor
}