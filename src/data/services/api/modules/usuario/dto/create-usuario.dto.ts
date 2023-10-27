export interface CreateUsuarioDto {
 
  tipoUsuario: tipoUsuario;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  senha: string;

}
enum tipoUsuario {
  Serralheiro,
  Administrador,
  Vendedor
}