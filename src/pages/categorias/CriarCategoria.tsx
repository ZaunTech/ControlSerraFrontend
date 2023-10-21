import { Box, Grid, Paper, TextField, Typography } from '@mui/material'
import React from 'react'
import { PaginaBase } from '../../ui/layouts'
import { FerramentasDeDetalhes } from '../../ui/components'
import { register } from 'module'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const createUserFormSchema = z
  .object({
    titulo: z.string().min(1,'Preencha esta campo'),
    descricao: z.string(),
  
  });
 console.log("teste");
  
function CriarCategoria() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createUserFormSchema),
  });
  function createUser(data: any) {
    console.log(data);
  }
  return (
    <PaginaBase
    titulo="Criar Categoria"
    barraDeFerramentas={
      <FerramentasDeDetalhes
        mostrarBotaoApagar={false}
        mostrarBotaoSalvar
        mostrarBotaoVoltar
        onClickSalvar={handleSubmit(createUser)}
      />
    }
  >

      <Box component={"form"} onSubmit={handleSubmit(createUser)}>
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
               <Typography>Titulo</Typography> 
               <TextField placeholder='Titulo' {...register("titulo")}/>
              </Grid>
              <Grid item>
               <Typography>Descricao</Typography> 
               <TextField placeholder='Descrição' {...register("descricao")}/>
              </Grid>
            </Grid>
          </Grid>  
      </Box>
      </Box>
    </PaginaBase>
  )
}

export default CriarCategoria