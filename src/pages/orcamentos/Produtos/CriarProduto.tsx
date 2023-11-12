import { useEffect, useState } from "react";
import { FerramentasDeDetalhes, TTipo } from "../../../ui/components";
import { PaginaBase } from "../../../ui/layouts";
import { Box, Grid, Paper, TextField, Typography } from "@mui/material";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { ProdutosService } from "../../../data/services/api/modules/produtos";

const createUserFormSchema = z.object({
  titulo: z.string().min(1, "Informe o nome do produto"),
  observacoes: z.string().optional(),
  quantidade: z.coerce.number().min(1,"Informe a quantidade"),
  idOrcamento: z.coerce.number(),
  
});

export const CriarProduto = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createUserFormSchema),
  });

  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    setValue("idOrcamento", id);
  }, []);

  function createUser(data: any) {
    ProdutosService.create(data)
      .then((result) => {
        if (!(result instanceof Error)) {
          navigate(-1);
        }
      })
      .catch((error) => {});
  }

  const [pageState, setPageState] = useState<TTipo>("novo");
  const [isEditable, setIsEditable] = useState<boolean>(false);

  useEffect(() => {
    if (pageState === "detalhes") {
      setIsEditable(false);
      return;
    }
    if (pageState === "editar" || pageState === "novo") {
      setIsEditable(true);
      return;
    }
  }, [pageState]);

  return (
    <PaginaBase
      titulo="Novo Produto"
      barraDeFerramentas={
        <FerramentasDeDetalhes
          tipo="novo"
          pageState={pageState}
          setPaiState={setPageState}
         
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
                <Box>
                <Typography>Titulo</Typography>
                <TextField placeholder="Titulo" disabled={!isEditable} {...register("titulo")} />
                </Box>
                {errors.titulo && (
                  <span>{errors.titulo.message?.toString()}</span>
                )}
              </Grid>
              <Grid item>
                <Box>
                <Typography>Quantidade</Typography>
                <TextField
                  type="number" disabled={!isEditable}
                  placeholder="Quantidade"
                  {...register("quantidade")}
                />
                </Box>
                {errors.quantidade && (
                  <span>{errors.quantidade.message?.toString()}</span>
                )}
              </Grid>

              <Grid item>
                <Typography>Observações</Typography>
                <TextField
                  placeholder="Observações" disabled={!isEditable}
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
};
