export interface CreateClienteDto {
    id: number;
    email: string;
    telefone: string;
    contaTipo: contaTipo;
    nome?:        string;
    cpf?:         string;
    rg?:          string;
    nomeFantasia?: string;
    razaoSocial?: string;
    cnpj?:        string;
    pais?:        string;
    cep?:         string;
    estado?:      string;
    cidade?:      string;
    bairro?:      string;
    rua?:       string;
    numero?:    string;
    complemento?: string;
    
  
}

enum contaTipo {
    Fisico,
    Juridico
  }
