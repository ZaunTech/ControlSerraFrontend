import { useEffect } from "react";
import { FerramentasDeDetalhes } from "../../ui/components";
import { PaginaBase } from "../../ui/layouts";
import { Box, Grid, Paper, TextField, Typography } from "@mui/material";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { ProdutosService } from "../../data/services/api/modules/produtos";

const createUserFormSchema = z.object({
  titulo: z.string().min(1, "Titulo não pode ser vazio"),
  observacoes: z.string(),
  quantidade: z.coerce.number().min(1),
});

export const EditarProduto = () => {
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
    ProdutosService.getById(Number(id)).then((result) => {
    
      if (result instanceof Error) {
        return Error;
      }
  
      setValue("titulo", result.titulo);
      setValue("observacoes", result.observacoes);
      setValue("quantidade", result.quantidade);
    });
  }, []);

  function createUser(data: any) {
    ProdutosService.updateById(Number(id),data)
      .then((result) => {
        if (!(result instanceof Error)) {
          navigate(-1);
        }
      })
      .catch((error) => {});
  }

  return (
    <PaginaBase
      titulo="Editar Produto"
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
};
