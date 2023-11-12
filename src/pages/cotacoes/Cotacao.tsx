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
  IVariante,
  InsumosService,
  VariantesService,
} from "../../data/services/api";
import {
  CotacoesService,
  ICotacao,
} from "../../data/services/api/modules/cotacoes";
import { useNavigate, useParams } from "react-router-dom";

export const Cotacao = () => {
  const [opcoes, setOpcoes] = useState<IFornecedor[]>([]);

  const [opcaoiInsumos, setopcaoInsumo] = useState<IVariante[]>([]);

  const shemaCotacao = z.object({
    idFornecedor: z.number().min(1,"Selecione um fornecedor"),
    idVariante: z.number().min(1,"Selecione um insumo"),
    valor: z.coerce.number().min(1,"Informe o valor do insumo"),

    data: z.coerce.date(),
  });

  useEffect(() => {
    VariantesService.getAll({perPage: 0})
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
      .catch((error) => { });
  }, []);

  useEffect(() => {
    FornecedoresService.getAll({perPage:0})
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
      .catch((error) => { });
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

        setValue("idVariante", data.idVariante);
        setValue("idFornecedor", data.idFornecedor);
        setValue("data", formattedDate);
        setValue("valor", data.valor);
      } else {
      }
    } catch (error) { }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const navigate = useNavigate();
  function createCotacao(data: any) {
   
    CotacoesService.updateById(Number(id), data)
      .then((result) => {
        console.log(result)
        setIsEditable(false);
        setPageState("detalhes");
      })
      .catch(() => { });
  }
  function createCotacaoFechar(data: any) {
    CotacoesService.updateById(Number(id), data)
      .then(() => {
        navigate(-1);
      })
      .catch(() => { });
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
                <Box>
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
                </Box>
                {errors.idFornecedor && (
                  <span>{errors.idFornecedor.message?.toString()}</span>
                )}
              </Grid>
              <Grid item>
                <Box>
                <Typography>Valor Do Insumo</Typography>
                <TextField
                  type="number"
                  placeholder="Valor do Insumo"
                  disabled={!isEditable}
                  {...register("valor")}
                />
                </Box>
                {errors.valor && (
                  <span>{errors.valor.message?.toString()}</span>
                )}
              </Grid>
              <Grid item>
                <Box>
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
                </Box>
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
                <Box>
                <Typography>Selecione o Insumo</Typography>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  disabled={!isEditable}
                  {...register("idVariante")}
                  options={opcaoiInsumos}
                  getOptionLabel={(opcaoInsumo) => ` ${opcaoInsumo.insumo.titulo || ''}  -  ${opcaoInsumo.variante || ''}`}
                  value={
                    opcaoiInsumos.find(
                      (option) => option.id === watch("idVariante")
                    ) || null
                  }
                  sx={{ width: 225 }}
                  renderInput={(params) => <TextField {...params} />}
                  onChange={(_, value) => {
                    setValue("idVariante", value?.id);
                  }}
                />
                </Box>
                {errors.idVariante && (
                  <span>{errors.idVariante.message?.toString()}</span>
                )}
              </Grid>

              
            </Grid>
          </Grid>
        </Box>
      </Box>
    </PaginaBase>
  );
};
