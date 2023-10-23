import React from 'react'
import { PaginaBase } from '../../ui/layouts'
import { FerramentasDeDetalhes } from '../../ui/components'
import { Box, Grid, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, TextField, Typography } from '@mui/material'
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { useFieldArray, useForm } from "react-hook-form";

const createUserFormSchema = z.object({
  titulo: z.string(),

  observacao: z.string(),
  produtos: z.array(z.object({
    id: z.coerce.number(),
    quantidade: z.coerce.number(),
  }))
});


function CriarOrcamento() {
  const [tipo, setTipo] = React.useState("1");
  const handleChange = (event: SelectChangeEvent) => {
    setTipo(event.target.value as string);
  };
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
  
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createUserFormSchema),
  });


  return (
    <PaginaBase
      titulo="Criar Fornecedor"
      barraDeFerramentas={
        <FerramentasDeDetalhes
          mostrarBotaoApagar={false}
          mostrarBotaoSalvar
          mostrarBotaoVoltar
         
        />
      }
    >

    <Box component={"form"} >
        <Box
          display={"flex"}
          margin={1}
          flexDirection={"column"}
          component={Paper}
          variant="outlined"
        >
          <Grid container direction="column" padding={2} spacing={3}>
            <Grid container item direction="row" spacing={4}>
              <Grid item>
                <Typography>Infromações Básicas</Typography>
              </Grid>
            </Grid>
            <Grid container item direction="row" spacing={4}>
              <Grid item>
                <Typography>Cliente</Typography>
                <TextField placeholder='Cliente'/>
              </Grid>
              <Grid item>
                <Typography>Data de Vencimento</Typography>
                <TextField type='date' placeholder='Data de Vencimento' />
              </Grid>
              <Grid item>
                <InputLabel id="tipo">Status</InputLabel>
                <Select
                  labelId="tipo"
                  id="tipo"
                  value={tipo}
                  {...register("tipo")}
                   onChange={handleChange}
                >
                  <MenuItem value={"Pendente"}>Pendente</MenuItem>
                  <MenuItem value={"Iniciado"}>Iniciado</MenuItem>
                  <MenuItem value={"Em_Processo"}>Em Processo</MenuItem>
                  <MenuItem value={"Concluido"}>Concluido</MenuItem>
                </Select>
              </Grid>
            </Grid>
          </Grid>
         </Box> 
       </Box> 



      


    </PaginaBase>
   
  )
}

export default CriarOrcamento