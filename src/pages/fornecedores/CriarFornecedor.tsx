import React from "react";
import { useState } from "react";
import { useMemo } from "react";
import { PaginaBase } from "../../ui/layouts";
import {
  FerramentasDaListagem,
  FerramentasDeDetalhes,
} from "../../ui/components";
import {
  Autocomplete,
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import {z}  from "zod"

import {zodResolver} from "@hookform/resolvers/zod"

import { useForm} from "react-hook-form"
import { useSubmit } from "react-router-dom";
import { getCep } from "../../data/services/api/axios-config/actions/cep";
import { ReplySharp } from "@mui/icons-material";

const createUserFormSchema = z.object({
 
  razaoSocial:  z.string(),
  nomeFantasia: z.string(),
  nome: z.string(),
  rg: z.string(),
  cpf: z.string(),
  cnpj:  z.string(),
  tipo: z.string(),
  email: z.string().min(1,'Faltou o nome').email("isso não é email"),
  telefone: z.string(),
  celular: z.string(),
  cep: z.number().min(8,'Cep invalido').max(8,'Cep Invalido'),
  endereco: z.string(),
  rua: z.string(),
  bairro: z.string(),
  cidade: z.string(),
  estado: z.string(),
  numero: z.string(),
  pais: z.string(),
  complemento: z.string(),
  }).refine((fileds) => fileds.tipo === "juridico", {
    path:['confemail'],
    message: 'Os emails precisam ser iguais'
    
  });   
  



function CriarFornecedor() {
  
  const [tipo, setTipo] = React.useState("juridico");
  const handleChange = (event: SelectChangeEvent) => {
    setTipo(event.target.value as string);
    setValue('nome', "");
    setValue('nomeFantasia', "");
    setValue('rg', "");
    setValue('cpf', "");
    setValue('cnpj', "");
    setValue('razaoSocial', "");
  };

  
  const  buscarCep = async (e : any) =>{
  const cep = e.target.value.replace(/\D/g,'');
  
  try {
    const response = await getCep(cep);
    if(response){
    const data = response.data;
    console.log(data)
    setValue('rua', data.logradouro);
    setValue('bairro', data.bairro);
    setValue('cidade', data.localidade);
    setValue('estado', data.uf);
    setValue('endereco', data.logradouro + " - " + data.localidade + " - " + data.bairro);
    
    
    }
  } catch (error) {
    console.error(error);
  
  }
}

  function createUser(data: any){
    console.log(data);
  }

  const {register, handleSubmit,setValue, formState:{errors}} = useForm({
    resolver: zodResolver(createUserFormSchema),
  });
  const [output, setOutput] = useState('');
  

  return (
    <PaginaBase
      titulo="Criar Fornecedor"
      barraDeFerramentas={
        <FerramentasDeDetalhes
          mostrarBotaoApagar={false}
          mostrarBotaoSalvar
          mostrarBotaoVoltar
          onClickSalvar={handleSubmit(createUser)}
        />
      }>
      <Box component={"form"} onSubmit={handleSubmit(createUser)}>
        <Box
          display={"flex"}
          margin={1}
          flexDirection={"column"}
          component={Paper}
          variant="outlined">
          <Grid container direction="column" padding={2} spacing={3}>
            <Grid container item direction="row" spacing={4}>
              <Grid item>
                <Typography>Dados Básicos</Typography>
              </Grid>
            </Grid>
            <Grid container item direction="row" spacing={4}>
             
              <Grid item>
               
                  <InputLabel id="tipo">Tipo</InputLabel>
                  <Select
                    labelId="tipo"
                    id="tipo"
                    value={tipo}
                    {...register('tipo')}
                    onChange={handleChange}>
                    <MenuItem value={"fisico"}>Fisico</MenuItem>
                    <MenuItem value={"juridico"}>Juridico</MenuItem>
                  </Select>
                
              </Grid>
              {tipo === "juridico" && (
                <>
                 <Grid item>
                 <Typography>Razão Social</Typography>
                 <TextField placeholder="Razão Social" {...register('razaoSocial')} />
               </Grid>
               <Grid item>
                 <Typography>Nome Fantasia</Typography>
                 <TextField placeholder="Nome Fantasia" {...register('nomeFantasia')}/>
               </Grid>
                <Grid item>
                  <Typography>CNPJ</Typography>
                  <TextField placeholder="CNPJ" {...register('cnpj')}/>
                </Grid>
                </>
              )}
            {tipo === "fisico" && (
              <>
              <Grid item>
                <Typography>Nome Completo</Typography>
                <TextField placeholder="Nome Completo" {...register('nome')} />
              </Grid>
              <Grid item>
                <Typography>RG</Typography>
                <TextField placeholder="RG" {...register('rg')}/>
              </Grid>
              <Grid item>
                <Typography>CPF</Typography>
                <TextField placeholder="CPF" {...register('cpf')} />
              </Grid>
              </>
            )}
            </Grid>
          </Grid>
        </Box>
        <Box
          display={"flex"}
          margin={1}
          flexDirection={"column"}
          component={Paper}
          variant="outlined">
          <Grid container direction="column" padding={2} spacing={3}>
            <Grid container item direction="row" spacing={4}>
              <Grid item>
                <Typography>Contatos</Typography>
              </Grid>
            </Grid>
            <Grid container item direction="row" spacing={4}>
              <Grid item>
                <Typography>Email</Typography>
                <TextField placeholder="Email" type="email" {...register('email')} />
              </Grid>
              <Grid item>
                <Typography>Telefone</Typography>
                <TextField placeholder="Telefone"  {...register('telefone')}/>
              </Grid>
              <Grid item>
                <Typography>Celular</Typography>
                <TextField placeholder="Celular" {...register('celular')} />
              </Grid>
            </Grid>
          </Grid>
        </Box>
        <Box
          display={"flex"}
          margin={1}
          flexDirection={"column"}
          component={Paper}
          variant="outlined">
          <Grid container direction="column" padding={2} spacing={2}>
            <Grid container item direction="row"  spacing={2}>
              <Grid item >
                <Typography>Endereço</Typography>
              </Grid>
            </Grid>
            <Grid container item direction="row" spacing={3}>
              <Grid item>
                <Typography>CEP</Typography>
                <TextField placeholder="CEP" {...register('cep')} onBlur={buscarCep}/>
              </Grid>
              <Grid item   xs={5}>
                <Typography>Endereço</Typography>
                <TextField placeholder="Endereço" fullWidth {...register('endereco')} />
              </Grid>
              <Grid item>
                <Typography>Rua</Typography>
                <TextField placeholder="Rua" {...register('rua')}/>
              </Grid>

              <Grid item >
                <Typography>Bairro</Typography>
                <TextField placeholder="Bairro"  {...register('bairro')} />
              </Grid>
            </Grid>
            <Grid container item direction="row"  spacing={2}>
              <Grid item xs={3}>
                <Typography>Cidade</Typography>
                <TextField placeholder="Cidade" fullWidth {...register('cidade')}/>
              </Grid>
              <Grid item xs={3} >
                <Typography>Estado</Typography>
                <TextField placeholder="Estado" fullWidth {...register('estado')}/>
              </Grid>
              <Grid item xs={3}>
                <Typography>Numero</Typography>
                <TextField placeholder="Numero"fullWidth {...register('numero')} />
              </Grid>
              <Grid item xs={3}>
                <Typography>Pais</Typography>
                <TextField placeholder="Pais" fullWidth {...register('pais')}/>
              </Grid>
              </Grid>
              <Grid container item direction="row" spacing={2}>
              <Grid item xs={9}>
                <Typography>Complemento</Typography>
                <TextField placeholder="Complemento" fullWidth {...register('complemento')}/>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </PaginaBase>
  );
}

export default CriarFornecedor;
