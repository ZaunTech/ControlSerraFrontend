import React from 'react'
import { FerramentasDeDetalhes } from '../../ui/components'
import { PaginaBase } from '../../ui/layouts'
import { Autocomplete, Box, Grid, Paper, TextField, Typography } from '@mui/material'
function CriarProduto() {
  return (
    <PaginaBase
    titulo="Criar Produto"
    barraDeFerramentas={<FerramentasDeDetalhes  
      mostrarBotaoApagar={false}
    />}>
  <Box component={'form'} >
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
                <Typography>Titulo</Typography>
              <TextField placeholder='Titulo'/>
              </Grid>
            
              <Grid item>
                <Typography>Observações</Typography>
              <TextField placeholder='Observações'/>
              </Grid>
           </Grid>
      </Grid>
    </Box>
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
                <Typography>Insumos</Typography>
             
              </Grid>
            </Grid>
      </Grid>
    </Box>
  </Box>

  </PaginaBase>
  )
}

export default CriarProduto