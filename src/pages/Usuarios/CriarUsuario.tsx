import React, { useEffect, useState } from 'react'
import { PaginaBase } from '../../ui/layouts'
import { FerramentasDeDetalhes, TTipo } from '../../ui/components'
import { useNavigate } from 'react-router-dom'
import { Box, Grid, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, TextField, Typography } from '@mui/material'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UsuariosService } from '../../data/services/api/modules/usuario'


const shemaUsuario = z.object({
    email: z.string().min(1,"Preencha o email"),
    senha: z.string().min(6,"Digite pelo menos 6 caracteres"),
    tipoUsuario: z.string(),
    nome: z.string().min(1,"Digite seu nome"),
    cpf:z.string().min(11,"Digite o CPF").max(11,"Digite somente os 11 numeros do CPF"),
    telefone: z.string().min(1,"Digite o telefone"),
   
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
    const navigate = useNavigate();

    function criarUsuario(data: any){
      UsuariosService.create(data).then((result)=>{
        navigate(-1)
        
      }).catch((error)=>{
        console.log(error)
      })
    }

  return (
    <PaginaBase
      titulo="Criar Usuario"
      barraDeFerramentas={<FerramentasDeDetalhes
        tipo="novo"
        pageState={pageState}
        setPaiState={setPageState}
        onClickSalvar={ handleSubmit(criarUsuario)}
        
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
                    value={tipo.toString()}
                    {...register("tipoUsuario")}
                    onChange={handleChange}
                  >
                    <MenuItem value={"Serralheiro"}>Serralheiro</MenuItem>
                    <MenuItem value={"Administrador"}>Administrador</MenuItem>
                    <MenuItem value={"Vendedor"}>Vendedor</MenuItem>
                  </Select>

                {errors.tipoUsuario && <span>{errors.tipoUsuario.message?.toString()}</span>}
              </Grid>
              <Grid item   xs={4}>
                <div>
                <Typography>Nome</Typography>
                <TextField   {...register("nome")}   />
                </div>
                {errors.nome && <span>{errors.nome.message?.toString()}</span>}
              </Grid>
              <Grid item>
              <div>
                <Typography>Email</Typography>
                <TextField type='email'  {...register("email")}   />
                </div>
                {errors.email && <span>{errors.email.message?.toString()}</span>}
              </Grid>
              <Grid item>
              <div>
                <Typography>Senha</Typography>
                <TextField type='password' {...register("senha")} />
                </div>
                {errors.senha && <span>{errors.senha.message?.toString()}</span>}
              </Grid>
              <Grid item>
                <div>
                <Typography>CPF</Typography>
                <TextField   {...register("cpf")}   />
                </div>
                {errors.cpf && <span>{errors.cpf.message?.toString()}</span>}
              </Grid>
              <Grid item>
                <Typography>Telefone</Typography>
                <TextField   {...register("telefone")}   />
                {errors.telefone && <span>{errors.telefone.message?.toString()}</span>}
              </Grid>
            </Grid>
        </Grid>      
        
        
        </Box>
    </Box>

  </PaginaBase>
  )
}
