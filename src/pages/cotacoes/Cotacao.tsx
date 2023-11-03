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
import {
  CotacoesService,
  ICotacao,
} from "../../data/services/api/modules/cotacoes";
import { useNavigate, useParams } from "react-router-dom";

export const Cotacao = () => {
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
      .catch((error) => { console.log(error)});
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
      .catch((error) => { console.log(error)});
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(shemaCotacao),
  });
  const { id } = useParams();

  const fetchData = async () => {
    try {
      const data: ICotacao | Error = await CotacoesService.getById(
        Number(id)
      );
      if (data instanceof Error) {
        return;
      }

      const dateObject = new Date(data.data);
      if (!isNaN(dateObject.getTime())) {
        const formattedDate = dateObject.toISOString().split("T")[0];

        setValue("idInsumo", data.idInsumo);
        setValue("idFornecedor", data.idFornecedor);
        setValue("data", formattedDate);
        setValue("unidade", data.unidade);
        setValue("valor", data.valor);
      } else {
      }
    } catch (error) {}
  };
  useEffect(() => {
    
    

    fetchData();
  }, []);

  const navigate = useNavigate();
  function createCotacao(data: any) {
    CotacoesService.updateById(Number(id), data)
      .then(() => {
        setIsEditable(false);
        setPageState("detalhes");
      })
      .catch(() => {});
  }
  function createCotacaoFechar(data: any) {
    CotacoesService.updateById(Number(id), data)
      .then(() => {
        navigate(-1);
      })
      .catch(() => {});
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
      titulo="Editar Cotação"
      barraDeFerramentas={
        <FerramentasDeDetalhes
        tipo="detalhes"
        pageState={pageState}
        setPaiState={setPageState}
        onClickCancelar={fetchData}
        onClickSalvarEFechar={handleSubmit(createCotacaoFechar)}
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
                  disabled={!isEditable}
                  options={opcoes}
                  value={
                    opcoes.find(
                      (option) => option.id === watch("idFornecedor")
                    ) || null
                  }
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
                  disabled={!isEditable}
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
                  disabled={!isEditable}
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
                  disabled={!isEditable}
                  {...register("idInsumo")}
                  options={opcaoiInsumos}
                  getOptionLabel={(opcaoiInsumos) => opcaoiInsumos.titulo ?? ""}
                  value={
                    opcaoiInsumos.find(
                      (option) => option.id === watch("idInsumo")
                    ) || null
                  }
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
                <TextField placeholder="Unidade de Medida" disabled={!isEditable} {...register("unidade")} />
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
