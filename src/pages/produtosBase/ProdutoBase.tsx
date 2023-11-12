import { FerramentasDeDetalhes, TTipo } from "../../ui/components";
import { PaginaBase } from "../../ui/layouts";
import { Box, Grid, Paper, TextField, Typography } from "@mui/material";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { IProdutoBase, ProdutosBaseService } from "../../data/services/api";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { IInsumosProdutoBase } from "../../data/services/api/modules/insumosProdutoBase";

const createUserFormSchema = z.object({
  titulo: z.string().min(1,"Digite o nome do Produto"),
  observacoes: z.string().optional(),
});

export const ProdutoBase = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createUserFormSchema),
  });

  const navigate = useNavigate();
  const {id} = useParams();
  const fetchData = async () => {
    try {
      const data: IProdutoBase | Error = await ProdutosBaseService.getById(Number(id));
      if (data instanceof Error) {
        return;
      }
      setValue("titulo", data.titulo);
      setValue("observacoes", data.observacoes);
     
    } catch (error) {}
  };
  useEffect(() => {
    fetchData();
  }, []);


  function createProduto(data: any) {
    ProdutosBaseService.updateById(Number(id),data)
      .then((result) => {
        if (!(result instanceof Error)) {
          setIsEditable(false)
          setPageState("detalhes")
        }
      })
      .catch((error) => {});
  }
  function createProdutoFechar(data: any) {
    ProdutosBaseService.updateById(Number(id),data)
      .then((result) => {
        if (!(result instanceof Error)) {
          navigate(-1);
        }
      })
      .catch((error) => {});
  }

  const [pageState, setPageState] = useState<TTipo>("detalhes");
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
      titulo="Editar Produto Base"
      barraDeFerramentas={
        <FerramentasDeDetalhes
          tipo="detalhes"
          pageState={pageState}
          onClickCancelar={fetchData}
          setPaiState={setPageState}
          onClickSalvarEFechar={handleSubmit(createProdutoFechar)}
          onClickSalvar={handleSubmit(createProduto)}
        />
      }
    >
      <Box component={"form"} onSubmit={handleSubmit(createProduto)}>
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
                <TextField placeholder="Titulo" {...register("titulo")}   disabled={!isEditable} />
                </Box>
                {errors.titulo && (
                  <span>{errors.titulo.message?.toString()}</span>
                )}
              </Grid>

              <Grid item>
                <Typography>Observações</Typography>
                <TextField
                  placeholder="Observações"
                  disabled={!isEditable}
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
