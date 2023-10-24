import React, { useEffect, useState } from "react";
import { FerramentasDeDetalhes } from "../../ui/components";
import { PaginaBase } from "../../ui/layouts";
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { useFieldArray, useForm } from "react-hook-form";
import {
  IInsumo,
  InsumosService,
  ProdutosBaseService,
  TListInsumos,
} from "../../data/services/api";
import {
  CreateInsumosProdutoBaseDto,
  IInsumosProdutoBase,
  InsumosProdutoBaseService,
} from "../../data/services/api/modules/insumosProdutoBase";
import { useParams } from "react-router-dom";

const createUserFormSchema = z.object({
  titulo: z.string(),
  observacoes: z.string(),
});



function Produto() {
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "insumos",
  });
  const [isAddingInsumo, setIsAddingInsumo] = useState<boolean>(false);
  function addNovoInsumo() {
    append({ titulo: "" });
    
  }

  function createUser(data: any) {
    console.log(data);
    ProdutosBaseService.create(data)
      .then((result) => {
      })
  }

  const [opcoes, setOpcoes] = useState<IInsumo[]>([]);
  useEffect(() => {
    InsumosService.getAll()
      .then((response) => {
        // Verifique se data é um array
        console.log("Resposta do serviço:", response);
        if (response instanceof Error) {
          console.error("Erro ao buscar categorias:", response);
          // Trate o erro conforme necessário, você pode querer mostrar uma mensagem de erro para o usuário
          return;
        }

        if (response && Array.isArray(response.data)) {
          const insumosMapeadas = response.data;
          console.log(insumosMapeadas);
          setOpcoes(insumosMapeadas);
        } else {
          console.error(
            "A resposta não é uma array válida de categorias:",
            response
          );
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar categorias:", error);
      });
  }, []);

 

  return (
    <PaginaBase
      titulo="Criar Produto"
      barraDeFerramentas={
        <FerramentasDeDetalhes
          mostrarBotaoApagar={false}
          onClickSalvar={handleSubmit(createUser)}
        />
      }>
      <Box component={"form"} onSubmit={handleSubmit(createUser)}>
        <Box
          display={"flex"}
          margin={1}
          flexDirection={"column"}
          component={Paper}
          variant="outlined">
          <Grid container direction="column" padding={2} spacing={3}>
            <Grid container item direction="row" spacing={4}>
              <Grid item>
                <Typography>Titulo</Typography>
                <TextField placeholder="Titulo" {...register("titulo")} />
                {errors.titulo && (
                  <span>{errors.titulo.message?.toString()}</span>
                )}
              </Grid>

              <Grid item>
                <Typography>Observações</Typography>
                <TextField
                  placeholder="Observações"
                  {...register("observacao")}
                />
                {errors.observacao && (
                  <span>{errors.observacao.message?.toString()}</span>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Box>
        <Box
          display={"flex"}
          margin={1}
          flexDirection={"column"}
          component={Paper}
          variant="outlined">
          <Grid container direction="column" padding={2} spacing={3}>
            <Grid container item direction="row" spacing={4}>
              <Grid item xs={5}>
                <Typography>Insumos</Typography>
              </Grid>
            </Grid>

            {fields.map((field, index) => {
              return  <InsumoDoProduto
              opcoes={opcoes}
              key={field.id}
              field={field}
              remove={() => remove(index)} // Use 'index' as the key
             />; //Mudar de index para o id do insumo
            })}
            <Grid item>
              <Button onClick={addNovoInsumo} disabled={isAddingInsumo}>
                Adicionar Insumo
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </PaginaBase>
  );
}

export default Produto;

interface IInsumoDoProdutoBase {
  opcoes: IInsumo[];
  remove: (index: number) => void;
}


const InsumoDoProduto = ({ opcoes , field, remove }: IInsumoDoProdutoBase & { field: any }) =>{
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedInsumo, setSelectedInsumo] = useState<IInsumo | null>(null);
  const [qtde, setQuantidade] = useState<number | null>(null);

  const insumoSchema = z.object({
    idInsumo: z.number(),
    titulo: z.string(),
    quantidade: z.number(),
  });

  const { id } = useParams();
  const productId: number = Number(id) ?? 0;
  useEffect(() => {
    console.log(selectedInsumo);
  }, [selectedInsumo]);
  
  return (
    

    <Grid container item direction="row" spacing={4}>
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
            setSelectedInsumo(value)
            
          }}
          disabled={!isEditing}
        />
      </Grid>
      <Grid item>
        <Typography>Quantidade</Typography>
        <TextField
          type="text"
          placeholder="Quantidade"
          onChange={(e)=>{
            setQuantidade(Number(e.target.value))
          }}
          disabled={!isEditing}
        />
      </Grid>
      <Grid item container>
        <Grid item>
          {isEditing && (
            <Button
              variant="contained"
              onClick={() => {

                console.log(selectedInsumo,qtde);

                const data : CreateInsumosProdutoBaseDto  = {
                  idProdutoBase: Number(id),
                  idInsumo: selectedInsumo?.id ? Number(selectedInsumo?.id) : 0,
                  quantidade: qtde || 0,
                }

                InsumosProdutoBaseService.create(data)
              }}>
              Salvar
            </Button>
          )}
          {!isEditing && (
            <Button
              variant="contained"
              onClick={() => {
                setIsEditing(true);
              }}>
              Editar
            </Button>
          )}
        </Grid>
        <Grid item>
          {isEditing && (
            <Button
              variant="contained"
              onClick={() => {
                setIsEditing(false);
              }}>
              Cancelar
            </Button>
          )}
          {!isEditing && (
            <Button
              variant="contained"
              onClick={() => {
                remove(field.id)
              
              }}>
              Remover
            </Button>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};
