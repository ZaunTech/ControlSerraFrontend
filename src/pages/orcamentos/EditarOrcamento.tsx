import React, { useEffect, useState } from "react";
import { PaginaBase } from "../../ui/layouts";
import { FerramentasDeDetalhes, TTipo } from "../../ui/components";
import {
  Autocomplete,
  Box,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ClientesService, ICliente } from "../../data/services/api";
import {
  IOrcamento,
  OrcamentosService,
} from "../../data/services/api/modules/orcamentos";
import { useNavigate, useParams } from "react-router-dom";

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const createUserFormSchema = z.object({
  idCliente: z.coerce.number().min(1, "Selecione o cliente"),
  observacoes: z.string().optional(),
  status: z.string(),
  validade: z.coerce
    .date()
    .min(new Date(getCurrentDate()), "Informe uma data valida"),
  prazoEstimadoProducao: z.coerce.number().min(1, "Digite um prazo estimado"),
});

export const EditarOrcamento = () => {
  const [opcoes, setOpcoes] = useState<ICliente[]>([]);
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

  useEffect(() => {
    ClientesService.getAll({ perPage: 0 })
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

  useEffect(() => {
    setarOrcamento();
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createUserFormSchema),
  });
  const [tipo, setTipo] = React.useState("Pendente");
  const [orcamento, setOrcamento] = useState<IOrcamento>();
  const handleChange = (event: SelectChangeEvent) => {
    setTipo(event.target.value as string);
  };

  const setarOrcamento = async () => {
    try {
      await OrcamentosService.getById(Number(id)).then((result) => {
        if (result instanceof Error) {
          return;
        }

        const dateObject = new Date(result.validade);
        if (!isNaN(dateObject.getTime())) {
          const formattedDate = dateObject.toISOString().split("T")[0];
          setValue("validade", formattedDate);
        }

        setValue("idCliente", result.idCliente);
        setValue("observacoes", result.observacoes);
        setTipo(result.status.toString());
        setValue("status", result.status.toString());
        setValue("prazoEstimadoProducao", result.prazoEstimadoProducao);
        setOrcamento(result);
      
      });
    } catch (error) {}
  };

  const { id } = useParams();
  const navigate = useNavigate();
  function createOrcamento(data: any) {
    OrcamentosService.updateById(Number(id), data)
      .then(() => {
        setIsEditable(false);
        setPageState("detalhes");
      })
      .catch(() => {});
  }
  function createOrcamentoFechar(data: any) {
    OrcamentosService.updateById(Number(id), data)
      .then(() => {
        console.log(data);
        navigate(-1);
      })
      .catch(() => {});
  }

  return (
    <PaginaBase
    titulo={`Editar Orçamento: ${id}`}
      barraDeFerramentas={
        <FerramentasDeDetalhes
          tipo="detalhes"
          pageState={pageState}
          onClickSalvar={handleSubmit(createOrcamento)}
          setPaiState={setPageState}
          onClickSalvarEFechar={handleSubmit(createOrcamentoFechar)}
          onClickCancelar={handleSubmit(setarOrcamento)}
        />
      }
    >
      <Box component={"form"} onSubmit={handleSubmit(createOrcamento)}>
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
                <Typography>Infromações Básicas</Typography>
              </Grid>
            </Grid>
            <Grid container item direction="row" spacing={4}>
              <Grid item>
                <Box>
                  <Typography>Selecione o Cliente</Typography>
                  <Autocomplete
                    disablePortal
                    {...register("idCliente")}
                    id="combo-box-demo"
                    disabled={!isEditable}
                    options={opcoes}
                    value={
                      opcoes.find(
                        (option) => option.id === watch("idCliente")
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
                      setValue("idCliente", value?.id);
                    }}
                  />
                </Box>
                {errors.idCliente && (
                  <span>{errors.idCliente.message?.toString()}</span>
                )}
              </Grid>
              <Grid item>
                <InputLabel id="status">Status</InputLabel>
                <Select
                  labelId="status"
                  id="status"
                  value={tipo}
                  {...register("status")}
                  onChange={handleChange}
                  disabled={!isEditable}
                >
                  <MenuItem value={"Pendente"}>Pendente</MenuItem>
                  <MenuItem value={"Em_Processo"}>Em Processo</MenuItem>
                  <MenuItem value={"Concluido"}>Concluido</MenuItem>
                </Select>

                {errors.status && (
                  <span>{errors.status.message?.toString()}</span>
                )}
              </Grid>

              <Grid item>
                <Typography>Observações</Typography>
                <TextField
                  type="text"
                  disabled={!isEditable}
                  placeholder="Observações"
                  {...register("observacoes")}
                />
                {errors.observacoes && (
                  <span>{errors.observacoes.message?.toString()}</span>
                )}
              </Grid>
              <Grid item>
                <Box>
                  <Typography>Data de Validade </Typography>
                  <TextField
                    type="date"
                    disabled={!isEditable}
                    placeholder="Data de Validade"
                    {...register("validade")}
                  />
                </Box>
                {errors.validade && (
                  <span>{errors.validade.message?.toString()}</span>
                )}
              </Grid>
              <Grid item>
                <Box>
                  <Typography>Prazo Estimado de produção (Dias) </Typography>
                  <TextField
                    type="number"
                    disabled={!isEditable}
                    placeholder="Prazo Estimado em Dias"
                    {...register("prazoEstimadoProducao")}
                  />
                </Box>
                {errors.prazoEstimadoProducao && (
                  <span>
                    {errors.prazoEstimadoProducao.message?.toString()}
                  </span>
                )}
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
                <Typography>Valores</Typography>
              </Grid>
            </Grid>
            <Grid container item direction="row" spacing={4}>
              <Grid item>
                <InputLabel id="valMaoDeObra">Mão de Obra</InputLabel>
                <TextField
                  type="number"
                  disabled={true}
                  value={orcamento?.totalMaoObra}
                />
              </Grid>
              <Grid item>
                <InputLabel id="valMaoDeObra">Insumos</InputLabel>
                <TextField
                  type="number"
                  disabled={true}
                  value={orcamento?.totalMateriais}
                />
              </Grid>
              <Grid item>
                <InputLabel id="valMaoDeObra">Total</InputLabel>
                <TextField
                  type="number"
                  disabled={true}
                  value={orcamento?.totalMaoObra + orcamento?.totalMateriais}
                />
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </PaginaBase>
  );
};
