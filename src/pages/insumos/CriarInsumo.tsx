import React from 'react'
import { FerramentasDeDetalhes } from '../../ui/components'
import { PaginaBase } from '../../ui/layouts'
import { Autocomplete, Box, Grid, Paper, TextField, Typography } from '@mui/material'

const opcoes = 
[
  {label:"Metais",id:1},
  {label:"Serras",id:2},
  {label:"Tintas",id:3},

]
function CriarInsumo() {
  return (
    <PaginaBase
    titulo="Insumos"
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
            <Grid container item direction="column" spacing={4}>
              <Grid item>
                <Typography>Titulo</Typography>
              <TextField placeholder='Titulo'/>
              </Grid>
              <Grid item>
              <Typography>Categoria</Typography>
              <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={opcoes}
                  sx={{ width: 225 }}
                  renderInput={(params) => <TextField {...params}  />}
                />
              </Grid>
              <Grid item>
                <Typography>Descrição</Typography>
              <TextField placeholder='Descrição'/>
              </Grid>
              <Grid item>
                <Typography>Unidade de Medida</Typography>
              <TextField placeholder='Unidade de Medida'/>
              </Grid>
             
           </Grid>
      </Grid>
      </Box>
  </Box>

  </PaginaBase>
  )
}

export default CriarInsumo