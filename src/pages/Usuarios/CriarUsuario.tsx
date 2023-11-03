import React, { useEffect, useState } from 'react'
import { PaginaBase } from '../../ui/layouts'
import { FerramentasDeDetalhes, TTipo } from '../../ui/components'

import { Box, Grid, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, TextField, Typography } from '@mui/material'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UsuarioServices } from '../../data/services/api/modules/usuario'


const shemaUsuario = z.object({
    email: z.string().min(1,"Preencha o email"),
    senha: z.string().min(6,"Digite pelo menos 6 caracteres"),
    tipoUsuario: z.string(),
    nome: z.string().min(1,"Digite seu nome"),
    cpf:z.string(),
    telefone: z.string(),
   
  });
export const CriarUsuario = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm({
        resolver: zodResolver(shemaUsuario),
      });
      const [tipo, setTipo] = React.useState("Serralheiro");

      const handleChange = (event: SelectChangeEvent) => {
        setTipo(event.target.value as string);
      };
    
    function criarUsuario(data: any){
      
      UsuarioServices.create(data).catch((error)=>{
        console.log(error);
      })
      
    }
    const [pageState, setPageState] = useState<TTipo>("novo");
    const [isEditable, setIsEditable] = useState<boolean>(false);
  
    useEffect(() => {
      if (pageState === "detalhes") {
        setIsEditable(false);
        return;
      }
      if (pageState === "editar" || pageState === "novo") {
        setIsEditable(true);
        return;
      }
    }, [pageState]);
  return (
    <PaginaBase
      titulo="Criar Usuario"
      barraDeFerramentas={<FerramentasDeDetalhes
        tipo="detalhes"
        pageState={pageState}
        setPaiState={setPageState}
        onClickSalvar={handleSubmit(criarUsuario)}
      />}>


    <Box component={"form"}  onSubmit={handleSubmit(criarUsuario)}>
        <Box
          display={"flex"}
          margin={1}
          flexDirection={"column"}
          component={Paper}
          variant="outlined"
        > 
        <Grid container direction="column" padding={2} spacing={3}>
          <Grid container item direction="column" spacing={4}>
             <Grid item>
              <InputLabel id="tipo">Tipo</InputLabel>
                  <Select
                    labelId="contaTipo"
                    id="contaTipo"
                    disabled={!isEditable}
                    value={tipo.toString()}
                    {...register("contaTipo")}
                    onChange={handleChange}
                  >
                    <MenuItem value={"Serralheiro"}>Serralheiro</MenuItem>
                    <MenuItem value={"Administrador"}>Administrador</MenuItem>
                    <MenuItem value={"Vendedor"}>Vendedor</MenuItem>
                  </Select>

                {errors.contaTipo && <span>{errors.contaTipo.message?.toString()}</span>}
              </Grid>
              <Grid item>
                <Typography>Nome</Typography>
                <TextField  disabled={!isEditable}  {...register("nome")}   />
              </Grid>
              <Grid item>
                <Typography>Email</Typography>
                <TextField type='email'  disabled={!isEditable} {...register("email")}   />
              </Grid>
              <Grid item>
                <Typography>Senha</Typography>
                <TextField type='password' disabled={!isEditable} {...register("senha")} />
              </Grid>
              <Grid item>
                <Typography>CPF</Typography>
                <TextField   disabled={!isEditable} {...register("cpf")}   />
              </Grid>
              <Grid item>
                <Typography>Telefone</Typography>
                <TextField   disabled={!isEditable} {...register("telefone")}   />
              </Grid>
            </Grid>
        </Grid>      
        
        
        </Box>
    </Box>

  </PaginaBase>
  )
}
