import React, { useEffect, useState } from 'react'
import { PaginaBase } from '../../ui/layouts'
import { FerramentasDeDetalhes, TTipo } from '../../ui/components'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Grid, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, TextField, Typography } from '@mui/material'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UsuariosService } from '../../data/services/api/modules/usuario'

const createUserFormSchema = z
  .object({
   
    password: z.string().min(1, "Faltou o nome"),
    confpassword: z.string().min(1, "Faltou o nome"),
  })
  .refine((fileds) => fileds.password === fileds.confpassword, {
    path: ["confpassword"],
    message: "As senhas precisam ser iguais",
  });

export const AlterarSenha = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm({
        resolver: zodResolver(createUserFormSchema),
      });
      

     
    
    
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
    const {id}= useParams();

    function criarUsuario(data: any){
     UsuariosService.alterarSenha(Number(id),data).then(()=>{
        navigate(-1);
     })
    }

  return (
    <PaginaBase
      titulo="Alterar Senha"
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
                 <div>
                <Typography>Senha</Typography>
                <TextField type='password'  {...register("password")}   />
                </div>
                {errors.password && <span>{errors.password.message?.toString()}</span>}
              </Grid>
              <Grid item>
                 <div>
                <Typography>Confrimar Senha</Typography>
                <TextField type='password'  {...register("confpassword")}   />
                </div>
                {errors.confpassword && <span>{errors.confpassword.message?.toString()}</span>}
              </Grid>
              
             
            </Grid>
        </Grid>      
        
        
        </Box>
    </Box>

  </PaginaBase>
  )
}
