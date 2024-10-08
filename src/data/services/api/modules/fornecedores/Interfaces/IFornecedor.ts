export interface IFornecedor {
    id: number
    email: string
    telefone: string
    contaTipo: string
    rua?: string
    numero?: string
    complemento?: string
    cep?: string
    bairro?: string
    cidade?: string
    estado?: string
    pais?: string
    nome?: string
    cpf?: string
    rg?: string
    nomeFantasia?: string
    razaoSocial?: string
    cnpj?: string
    createdAt: Date
    updatedAt: Date
}
