import { useEffect, useState } from 'react'
import { FerramentasDeDetalhes } from '../../ui/components'
import { PaginaBase } from '../../ui/layouts'
import { Autocomplete, Box, Grid, Paper, TextField, Typography } from '@mui/material'
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { CategoriasService, ICategoria, InsumosService } from '../../data/services/api';

const createUserFormSchema = z.object({
  titulo: z.string(),
  idCategoria: z.coerce.number(),
  descricao: z.string(),
  unidadeMedida: z.string(),

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

    InsumosService.create(data).catch((erro) => {
      console.log(erro);
    })
  }
  const [opcoes, setOpcoes] = useState<ICategoria[]>([]);


  useEffect(() => {
    CategoriasService.getAll()
      .then((response) => {
        // Verifique se data é um array
        console.log('Resposta do serviço:', response);
        if (response instanceof Error) {
          console.error('Erro ao buscar categorias:', response);
          // Trate o erro conforme necessário, você pode querer mostrar uma mensagem de erro para o usuário
          return;
        }

        if (response && Array.isArray(response.data)) {

          const categoriasMapeadas = response.data;
          console.log(categoriasMapeadas);
          setOpcoes(categoriasMapeadas);
        } else {
          console.error('A resposta não é uma array válida de categorias:', response);
        }
      })
      .catch((error) => {
        console.error('Erro ao buscar categorias:', error);
      });
  }, []);


  return (
    <PaginaBase
      titulo="Insumos"
      barraDeFerramentas={<FerramentasDeDetalhes
        mostrarBotaoApagar={false}
        onClickSalvar={handleSubmit(createUser)}
      />}>
      <Box component={'form'} onSubmit={handleSubmit(createUser)}>
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
                <TextField placeholder='Titulo' {...register("titulo")} />
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
                      setValue("idCategoria", value.id)
                    }
                  }}
                />
              </Grid>
              <Grid item>
                <Typography>Descrição</Typography>
                <TextField placeholder='Descrição'  {...register("descricao")} />
              </Grid>
              <Grid item>
                <Typography>Unidade de Medida</Typography>
                <TextField placeholder='Unidade de Medida' {...register('unidadeMedida')} />
              </Grid>

            </Grid>
          </Grid>
        </Box>
      </Box>

    </PaginaBase>
  )
}

export default CriarInsumo