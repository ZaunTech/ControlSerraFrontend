import React, { useEffect, useState } from 'react'
import { useMemo } from "react";
import { PaginaBase } from "../../ui/layouts";
import {
  FerramentasDaListagem,
  FerramentasDeDetalhes,
} from "../../ui/components";
import { Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CategoriasService, ICategoria, IInsumo, InsumosService } from '../../data/services/api';
import { z } from 'zod';
import { Autocomplete, Box, Grid, Paper, TextField, Typography } from '@mui/material';
import { type } from 'os';

const createUserFormSchema = z.object({
  titulo: z.string().min(1,"Preencha o Titulo"),
  idCategoria: z.coerce.number().optional(),
  descricao: z.string(),
  unidadeMedida: z.string(),

});

function Insumo() {
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    setValue,
    watch,

    formState: { errors },
  } = useForm({
    resolver: zodResolver(createUserFormSchema),
  });

 const  navigate = useNavigate();
  function createUser(data: any) {
    console.log(data);
    
    InsumosService.updateById(Number(id), data).then(()=>{    
      navigate(-1);
    }).catch((error)=>{
      console.log(error);
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
   
useEffect(()=>{


    const fetchData = async () => {
      try {
        const data: IInsumo | Error = await InsumosService.getById(Number(id));
        if(data instanceof Error){
          return;
        }
        setValue("titulo",data.titulo);
        setValue("descricao",data.descricao);
        setValue("unidadeMedida",data.unidadeMedida);
        setValue("idCategoria",data.idCategoria)
        // Do something with the 'data' here
        
      } catch (error) {
        // Handle errors here
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  },[]); 

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
                {errors.titulo && <span>{errors.titulo.message?.toString()}</span>}
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
                  value={opcoes.find((option) => option.id === watch("idCategoria")) || null}
                  onChange={(_, value) => {
                    if (value !== null) {
                      setValue("categoria", [value]);
                      setValue("idCategoria", value.id)
                    }
                  }}
                />
                  {errors.idCategoria && <span>{errors.idCategoria.message?.toString()}</span>}
              </Grid>
              <Grid item>
                <Typography>Descrição</Typography>
                <TextField placeholder='Descrição'  {...register("descricao")} />
                {errors.descricao && <span>{errors.descricao.message?.toString()}</span>}
              </Grid>
              <Grid item>
                <Typography>Unidade de Medida</Typography>
                <TextField placeholder='Unidade de Medida' {...register('unidadeMedida')} />
                {errors.unidadeMedida && <span>{errors.unidadeMedida.message?.toString()}</span>}
              </Grid>

            </Grid>
          </Grid>
        </Box>
      </Box>

    </PaginaBase>
  )
}

export default Insumo