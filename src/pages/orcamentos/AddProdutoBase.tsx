import { useEffect, useState } from "react";
import { FerramentasDeDetalhes, TTipo } from "../../ui/components";
import { PaginaBase } from "../../ui/layouts";
import {
  Autocomplete,
  Box,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { IProdutoBase, ProdutosBaseService } from "../../data/services/api";
import { useParams } from "react-router-dom";
import { ProdutosService } from "../../data/services/api/modules/produtos";

const createUserFormSchema = z.object({
  titulo: z.string(),
  quantidade: z.coerce.number(),
  orcamentoId: z.coerce.number(),
  observacoes: z.string(),
  id: z.coerce.number(),
});

export const AddProdutoBase = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createUserFormSchema),
  });

  const [opcaoiInsumos, setopcaoInsumo] = useState<IProdutoBase[]>([]);

  useEffect(() => {
    ProdutosBaseService.getAll()
      .then((response) => {
        if (response instanceof Error) {
          return;
        }

        if (response && Array.isArray(response.data)) {
          const InsumosMapeadas = response.data;
          setopcaoInsumo(InsumosMapeadas);
        } else {
        }
      })
      .catch((error) => {console.log(error)});
  }, []);

  const { id } = useParams();
  useEffect(() => {
    setValue("orcamentoId", id);
  }, []);

  function createUser(data: any) {
    console.log(data);
    ProdutosService.addProdutoBase(data)
      .then((result) => {
        if (!(result instanceof Error)) {
        }
      })
      .catch((error) => {console.log(error)});
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
      titulo="Adicionar Produto Base ao Orçamento"
      barraDeFerramentas={
        <FerramentasDeDetalhes
          pageState={pageState}
          setPaiState={setPageState}
          tipo="novo"          
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
                <Typography>Selecione o Produto</Typography>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  {...register("idInsumo")}
                  options={opcaoiInsumos}
                  getOptionLabel={(opcaoiInsumos) => opcaoiInsumos.titulo ?? ""}
                  sx={{ width: 225 }}
                  disabled={!isEditable}
                  renderInput={(params) => <TextField {...params} />}
                  onChange={(_, value) => {
                    setValue("titulo", value?.titulo);
                    setValue("id",value?.id);
                  }}
                />
                {errors.idInsumo && (
                  <span>{errors.idInsumo.message?.toString()}</span>
                )}
              </Grid>

              <Grid item>
                <Typography>Observações</Typography>
                <TextField
                  placeholder="Observações"  disabled={!isEditable}
                  {...register("observacoes")}
                />
                {errors.observacao && (
                  <span>{errors.observacao.message?.toString()}</span>
                )}
              </Grid>
              <Grid item>
                <Typography>Quantidade</Typography>
                <TextField
                  placeholder="Quantidade"  disabled={!isEditable}
                  {...register("quantidade")}
                />
                {errors.quantidade && (
                  <span>{errors.quantidade.message?.toString()}</span>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </PaginaBase>
  );
};
