import { FerramentasDeDetalhes } from "../../ui/components";
import { PaginaBase } from "../../ui/layouts";
import { Box, Grid, Paper, TextField, Typography } from "@mui/material";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { ProdutosBaseService } from "../../data/services/api";
import { useNavigate } from "react-router-dom";

const createUserFormSchema = z.object({
  titulo: z.string(),
  observacoes: z.string(),
});

export const CriarProdutoBase = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createUserFormSchema),
  });

  const navigate = useNavigate();

  function createUser(data: any) {
    ProdutosBaseService.create(data)
      .then((result) => {
        if (!(result instanceof Error)) {
          navigate(`/produtos/${result.id}`);
        }
      })
      .catch((error) => {});
  }

  return (
    <PaginaBase
      titulo="Novo Produto Base"
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
