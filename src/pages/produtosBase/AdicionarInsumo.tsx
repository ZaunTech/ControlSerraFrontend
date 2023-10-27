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

const createUserFormSchema = z.object({
  idProdutoBase: z.coerce.number(),
  quantidade: z.coerce.number(),
  idInsumo: z.coerce.number(),
  dimensoes: z.string(),
});

function CriarItemInsumoProdutoBase() {
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

  const [opcaoiInsumos, setopcaoInsumo] = useState<IInsumo[]>([]);
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
          const InsumosMapeadas = response.data;
          console.log(InsumosMapeadas);
          setopcaoInsumo(InsumosMapeadas);
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

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    setValue("idProdutoBase", Number(id));
  });

  function createUser(data: any) {
    console.log(data);

    InsumosProdutoBaseService.create(data)
      .then((result) => {
        if (!(result instanceof Error)) {
          navigate(-1);
        }
      })
      .catch((error) => {
        console.error("Erro ao criar ProdutosBase:", error);
        // Trate o erro conforme necessário, você pode querer mostrar uma mensagem de erro para o usuário
      });
  }

  return (
    <PaginaBase
      titulo="Adicionar Insumos base"
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
                <Typography>Selecione o Insumo</Typography>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  {...register("idInsumo")}
                  options={opcaoiInsumos}
                  getOptionLabel={(opcaoiInsumos) => opcaoiInsumos.titulo ?? ""}
                  sx={{ width: 225 }}
                  renderInput={(params) => <TextField {...params} />}
                  onChange={(_, value) => {
                    setValue("idInsumo", value?.id);
                  }}
                />
                {errors.idInsumo && (
                  <span>{errors.idInsumo.message?.toString()}</span>
                )}
              </Grid>
              <Grid item>
                <Typography>Quantidade</Typography>
                <TextField
                  type="number"
                  placeholder="Quantidade"
                  {...register("quantidade")}
                />
                {errors.quantidade && (
                  <span>{errors.quantidade.message?.toString()}</span>
                )}
              </Grid>
              <Grid item>
                <Typography>Dimensões</Typography>
                <TextField placeholder="Dimensões" {...register("dimensoes")} />
                {errors.dimensoes && (
                  <span>{errors.dimensoes.message?.toString()}</span>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </PaginaBase>
  );
}

export default CriarItemInsumoProdutoBase;
