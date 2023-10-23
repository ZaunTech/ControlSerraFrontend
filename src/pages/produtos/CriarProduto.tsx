import React, { useEffect, useState } from 'react'
import { FerramentasDeDetalhes } from '../../ui/components'
import { PaginaBase } from '../../ui/layouts'
import { Autocomplete, Box, Button, Grid, Paper, TextField, Typography } from '@mui/material'
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { useFieldArray, useForm } from "react-hook-form";
import { IInsumo, InsumosService, ProdutosBaseService, TListInsumos } from '../../data/services/api';
import { IInsumosProdutoBase, InsumosProdutoBaseService } from '../../data/services/api/modules/insumosProdutoBase';

const createUserFormSchema = z.object({
  titulo: z.string(),
  observacao: z.string(),
  insumos: z.array(z.object({
    
    idInsumo: z.coerce.number(),
    quantidade: z.coerce.number(),
  }))
});

function CriarProduto() {
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

  const {fields , append, remove} = useFieldArray({
    control, 
    name: "insumos",
  })
  
  function addNovoInsumo(){
    append({titulo: ''})
  }
  function createUser(data: any) {

   ProdutosBaseService.create(data).then((result)=>{
   
      if (!(result instanceof Error)) {

        console.log('IDs dos insumos:', data.insumos.map((insumo: IInsumosProdutoBase) => insumo.idInsumo));
    const dataInsumos: IInsumosProdutoBase[] = data.insumos.map((insumo : IInsumosProdutoBase) => ({
      
      ...insumo,
      idProdutoBase: result.id
   
      // Associando o insumo ao produto recém-criado
    }));

    console.log(dataInsumos);
    Promise.all(
      dataInsumos.map((insumo) =>{ 
     
        InsumosProdutoBaseService.create(insumo)
      })
    )
      .then((insumosProdutoBaseResults) => {
        // Aqui você tem um array de resultados das chamadas InsumosProdutoBaseService.create
        console.log('deu certo: ' , insumosProdutoBaseResults);

        // Faça qualquer coisa adicional que você precise fazer após salvar InsumosProdutoBase
      })
      .catch((error) => {
        console.error('Erro ao criar InsumosProdutoBase:', error);
        // Trate o erro conforme necessário, você pode querer mostrar uma mensagem de erro para o usuário
      });
  }})
  .catch((error) => {
    console.error('Erro ao criar ProdutosBase:', error);
    // Trate o erro conforme necessário, você pode querer mostrar uma mensagem de erro para o usuário
  });
   
      
  }

  const  [opcoes, setOpcoes] = useState<IInsumo[]>([]);
    useEffect(() => {
      InsumosService.getAll()
        .then((response) => {
          // Verifique se data é um array
          console.log('Resposta do serviço:', response);
          if (response instanceof Error) {
            console.error('Erro ao buscar categorias:', response);
            // Trate o erro conforme necessário, você pode querer mostrar uma mensagem de erro para o usuário
            return;
          }
  
          if (response && Array.isArray(response.data)) {
           
            const insumosMapeadas = response.data;
            console.log(insumosMapeadas);
            setOpcoes(insumosMapeadas);
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
    titulo="Criar Produto"
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
            <Grid container item direction="row" spacing={4}>
              <Grid item>
                <Typography>Titulo</Typography>
              <TextField placeholder='Titulo' {...register("titulo")}/>
              </Grid>
            
              <Grid item>
              <Typography>Observações</Typography>
              <TextField placeholder='Observações' {...register("observacao")}/>
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
            <Grid container item direction="row" spacing={4} >
            <Grid item xs={5}>
                <Typography>Insumos</Typography>
             
            </Grid>
            <Grid item >
                <Button onClick={addNovoInsumo}>Adicionar Insumo</Button>
             
            </Grid>

            </Grid>
            
              {fields.map((field,index) => {
                return (<Grid container item direction="row" spacing={4} key={field.id }>
                <Grid item>
               
                <Typography>Titulo</Typography>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={opcoes}
                  getOptionLabel={(option) => option.titulo}
                  sx={{ width: 225 }}
                  renderInput={(params) => <TextField {...params} />}
                  onChange={(_, value) => {
                    if (value !== null) {
                    setValue(`insumos.${index}.idInsumo`, value.id);   
                    }
                  }}
                />
                
                
                </Grid>
                <Grid item >
                <Typography>Quantidade</Typography>
                <TextField type='text' placeholder='Quantidade' {...register(`insumos.${index}.quantidade`)} />
                
                </Grid>
                <Grid item>
                <Button variant="contained" onClick={() => remove(index)}>Remover Insumo</Button>
                </Grid>
                
                </Grid>
                
            
            )
              }) }
             
           
      </Grid>
    </Box>
  </Box>

  </PaginaBase>
  )
}

export default CriarProduto