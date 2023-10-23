import React, { useCallback, useEffect, useState } from 'react'
import { FerramentasDeDetalhes } from '../../ui/components'
import { PaginaBase } from '../../ui/layouts'
import { Autocomplete, Box, Grid, Paper, TextField, Typography } from '@mui/material'
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { ICategoria } from '../../data/services/api';







const createUserFormSchema = z.object({
titulo: z.string(),
categoria: z.array(z.object({
  id: z.number(),
  tipo: z.string(),
  titulo: z.string(),
  descricao: z.string().optional(),
 
})),
descricao: z.string(),
unidade: z.string(),

});

function CriarInsumo() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
  
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createUserFormSchema),
  });

  function createUser(data: any) {
    console.log(data);
  }
  const  [opcoes, setOpcoes] = useState<ICategoria[]>([]);

  useEffect(()=>{
    const data: ICategoria[] = [
      { titulo: "Metal", id: 1, descricao: "", tipo: ""},
      {titulo: "Barra", id:2, descricao: "", tipo: ""}
      ];
    console.log(data);
  setOpcoes(data);
  
  },[]);
 
  return (
    <PaginaBase
    titulo="Insumos"
    barraDeFerramentas={<FerramentasDeDetalhes  
      mostrarBotaoApagar={false}
      onClickSalvar={handleSubmit(createUser)}
    />}>
  <Box component={'form'}  onSubmit={handleSubmit(createUser)}>
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
              <Typography>Categoria</Typography>
              <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={opcoes}
                  getOptionLabel={(option) => option.titulo}
                  sx={{ width: 225 }}
                  renderInput={(params) => <TextField {...params} />}
                  onChange={(_, value) => {
                    if (value !== null) {
                    setValue("categoria", [value]);
                    }
                  }}
                />
              </Grid>
              <Grid item>
                <Typography>Descrição</Typography>
              <TextField placeholder='Descrição'  {...register("descricao")}/>
              </Grid>
              <Grid item>
                <Typography>Unidade de Medida</Typography>
              <TextField placeholder='Unidade de Medida' {...register('unidade')}/>
              </Grid>
             
           </Grid>
      </Grid>
      </Box>
  </Box>

  </PaginaBase>
  )
}

export default CriarInsumo