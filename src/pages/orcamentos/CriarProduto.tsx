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
import { useNavigate, useParams } from "react-router-dom";
import { setTimeout } from "timers/promises";
import { CreateProdutoDto, IProduto, ProdutosService } from "../../data/services/api/modules/produtos";
import { IOrcamento, OrcamentosService } from "../../data/services/api/modules/orcamentos";

const createUserFormSchema = z.object({
  titulo: z.string().min(1,"Titulo não pode ser vazio"),
  observacoes: z.string(),
  orcamentoId: z.coerce.number(),
  quantidade: z.coerce.number().min(1),
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

  const navigate = useNavigate();
  const {id} = useParams();
  useEffect(()=>{

    setValue("orcamentoId",id);
  },[]);

  function createUser(data: any) {
        console.log(data);
    ProdutosService.create(data)
      .then((result) => {
        if (!(result instanceof Error)) {
          navigate(`/orcamentos/${id}`);
        }
      })
      .catch((error) => {
        console.error("Erro ao criar ProdutosBase:", error);
        // Trate o erro conforme necessário, você pode querer mostrar uma mensagem de erro para o usuário
      });
  }

  return (
    <PaginaBase
      titulo="Criar Produto"
      barraDeFerramentas={
        <FerramentasDeDetalhes
          mostrarBotaoApagar={false}
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
            <Grid container item direction="row" spacing={4}>
              <Grid item>
                <Typography>Titulo</Typography>
                <TextField placeholder="Titulo" {...register("titulo")} />
                {errors.titulo && (
                  <span>{errors.titulo.message?.toString()}</span>
                )}
              </Grid>
              <Grid item>
                <Typography>Quantidade</Typography>
                <TextField type="number"
                  placeholder="Quantidade"
                  {...register("quantidade")}
                />
                {errors.quantidade && (
                  <span>{errors.quantidade.message?.toString()}</span>
                )}
              </Grid>

              <Grid item>
                <Typography>Observações</Typography>
                <TextField
                  placeholder="Observações"
                  {...register("observacoes")}
                />
                {errors.observacao && (
                  <span>{errors.observacao.message?.toString()}</span>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </PaginaBase>
  );
}

export default CriarProduto;
