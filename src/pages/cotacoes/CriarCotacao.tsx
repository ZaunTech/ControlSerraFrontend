import { useEffect } from "react";
import { useState } from "react";
import { PaginaBase } from "../../ui/layouts";
import { FerramentasDeDetalhes, TTipo } from "../../ui/components";
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
import {
  FornecedoresService,
  IFornecedor,
  IInsumo,
  InsumosService,
} from "../../data/services/api";
import { CotacoesService } from "../../data/services/api/modules/cotacoes";
import { useNavigate } from "react-router-dom";
export const CriarCotacao = () => {
  const [opcoes, setOpcoes] = useState<IFornecedor[]>([]);

  const [opcaoiInsumos, setopcaoInsumo] = useState<IInsumo[]>([]);

  const shemaCotacao = z.object({
    idFornecedor: z.number(),
    idInsumo: z.number(),
    valor: z.coerce.number(),
    unidade: z.string(),
    data: z.coerce.date(),
  });

  useEffect(() => {
    InsumosService.getAll()
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
      .catch((error) => {});
  }, []);

  useEffect(() => {
    FornecedoresService.getAll()
      .then((response) => {
        if (response instanceof Error) {
          return;
        }

        if (response && Array.isArray(response.data)) {
          const FornecedoresMapeadas = response.data;
          setOpcoes(FornecedoresMapeadas);
        } else {
        }
      })
      .catch((error) => {});
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(shemaCotacao),
  });

  const navigate = useNavigate();
  function createCotacao(data: any) {
    CotacoesService.create(data)
      .then(() => {
        navigate(-1);
      })
      .catch(() => {});
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
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Preencher o valor inicial ao montar o componente
  useEffect(() => {
    setValue('data', getCurrentDate());
  }, []);

  return (
    <PaginaBase
      titulo="Nova Cotação"
      barraDeFerramentas={
        <FerramentasDeDetalhes
        tipo="novo"
        pageState={pageState}
        setPaiState={setPageState}
          onClickSalvar={handleSubmit(createCotacao)}
        />
      }
    >
      <Box component={"form"} onSubmit={handleSubmit(createCotacao)}>
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
                <Typography>Informação Fornecedor</Typography>
              </Grid>
            </Grid>
            <Grid container item direction="row" spacing={4}>
              <Grid item>
                <Typography>Selecione o Fonernecedor</Typography>
                <Autocomplete
                  disablePortal
                  {...register("idFornecedor")}
                  id="combo-box-demo"
                  options={opcoes}
                  getOptionLabel={(option) =>
                    option.nomeFantasia ??
                    option.nome ??
                    option.razaoSocial ??
                    ""
                  }
                  sx={{ width: 225 }}
                  renderInput={(params) => <TextField {...params} />}
                  onChange={(_, value) => {
                    setValue("idFornecedor", value?.id);
                  }}
                />

                {errors.idFornecedor && (
                  <span>{errors.idFornecedor.message?.toString()}</span>
                )}
              </Grid>
              <Grid item>
                <Typography>Valor Do Insumo</Typography>
                <TextField
                  type="number"
                  placeholder="Valor do Insumo"
                  {...register("valor")}
                />
                {errors.valor && (
                  <span>{errors.valor.message?.toString()}</span>
                )}
              </Grid>
              <Grid item>
                <Typography>Data que foi cotado</Typography>
                <TextField
                  type="date"
                  placeholder="data"
                  {...register("data")}
                  onChange={(e) => {
                    setValue("data", e.target.value);
                  }}
                />
                {errors.data && <span>{errors.data.message?.toString()}</span>}
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
            <Grid container item direction="row" spacing={4}>
              <Grid item>
                <Typography>Informação Insumo</Typography>
              </Grid>
            </Grid>
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
                <Typography>Unidade de Medida</Typography>
                <TextField placeholder="Unidade de Medida" {...register("unidade")} />
                {errors.unidade && (
                  <span>{errors.unidade.message?.toString()}</span>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </PaginaBase>
  );
};

export default CriarCotacao;
