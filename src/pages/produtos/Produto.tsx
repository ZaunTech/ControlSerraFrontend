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
  IInsumosProdutoBase,
  InsumosProdutoBaseService,
} from "../../data/services/api/modules/insumosProdutoBase";

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

  function addNovoInsumo() {
    append({ titulo: "" });
    setIsAddingInsumo(true);
  }

  function createUser(data: any) {
    console.log(data);
    ProdutosBaseService.create(data)
      .then((result) => {
        if (!(result instanceof Error)) {
          console.log(
            "IDs dos insumos:",
            data.insumos.map((insumo: IInsumosProdutoBase) => insumo.idInsumo)
          );
          const dataInsumos: IInsumosProdutoBase[] = data.insumos.map(
            (insumo: IInsumosProdutoBase) => ({
              ...insumo,
              idProdutoBase: result.id,

              // Associando o insumo ao produto recém-criado
            })
          );

          console.log(dataInsumos);
          Promise.all(
            dataInsumos.map((insumo) => {
              InsumosProdutoBaseService.create(insumo);
            })
          )
            .then((insumosProdutoBaseResults) => {
              // Aqui você tem um array de resultados das chamadas InsumosProdutoBaseService.create
              console.log("deu certo: ", insumosProdutoBaseResults);

              // Faça qualquer coisa adicional que você precise fazer após salvar InsumosProdutoBase
            })
            .catch((error) => {
              console.error("Erro ao criar InsumosProdutoBase:", error);
              // Trate o erro conforme necessário, você pode querer mostrar uma mensagem de erro para o usuário
            });
        }
      })
      .catch((error) => {
        console.error("Erro ao criar ProdutosBase:", error);
        // Trate o erro conforme necessário, você pode querer mostrar uma mensagem de erro para o usuário
      });
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

  const [isAddingInsumo, setIsAddingInsumo] = useState<boolean>(false);

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
              insumos={insumos}
              index={index}
              key={index}
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
}

const InsumoDoProduto = ({ opcoes }: IInsumoDoProdutoBase) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const insumoSchema = z.object({
    idInsumo: z.number(),
    titulo: z.string(),
    quantidade: z.number(),
  });

  
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
            if (value !== null) {
              setValue(`insumos.${index}.idInsumo`, value.id);
              setValue(`insumos.${index}.titulo`, value.titulo);
            }
          }}
          disabled={!isEditing}
        />
      </Grid>
      <Grid item>
        <Typography>Quantidade</Typography>
        <TextField
          type="text"
          placeholder="Quantidade"
          //{...register(`insumos.${index}.quantidade`)}
          disabled={!isEditing}
        />
      </Grid>
      <Grid item container>
        <Grid item>
          {isEditing && (
            <Button
              variant="contained"
              onClick={() => {
                if (id == null) {
                  InsumosProdutoBaseService.create(data);
                  setIsEditing(false);
                  return;
                }
                InsumosProdutoBaseService.updateById(id, data);
                setIsEditing(false);
                return;
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
                //remove(index)}
              }}>
              Remover
            </Button>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};
