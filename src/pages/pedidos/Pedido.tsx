import {
  Autocomplete,
  Box,
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { FerramentasDeDetalhes, TTipo } from "../../ui/components";
import { PaginaBase } from "../../ui/layouts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";
import React from "react";
import {
  IPedido,
  PedidosService,
} from "../../data/services/api/modules/pedidos";
import { useNavigate, useParams } from "react-router-dom";
import {
  IOrcamento,
  OrcamentosService,
} from "../../data/services/api/modules/orcamentos";

const createUserFormSchema = z.object({
  pagamento: z.coerce.number(),
  idOrcamento: z.coerce.number(),
  status: z.string(),
});

export const Pedido = () => {
  const navigate = useNavigate();
  function createPedido(data: any) {
    console.log(data);
    PedidosService.updateById(Number(id), data)
      .then((result) => {
        setPageState("detalhes");
        setIsEditable(false);
        fetchData();
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function createPedidoFechar(data: any) {
    console.log(data);
    PedidosService.updateById(Number(id), data)
      .then((result) => {
        setPageState("detalhes");
        navigate(-1);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createUserFormSchema),
  });

  const [pageState, setPageState] = useState<TTipo>("detalhes");
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [orcamento, setOrcamento] = useState<IOrcamento>();
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

  const [tipo, setTipo] = React.useState("Pendente");
  const handleChange = (event: SelectChangeEvent) => {
    setTipo(event.target.value as string);
  };
  const [opcoes, setOpcoes] = useState<IOrcamento[]>([]);

  useEffect(() => {
    OrcamentosService.getAllConcluded()
      .then((response) => {
        if (response instanceof Error) {
          return;
        }

        if (response && Array.isArray(response)) {
          const FornecedoresMapeadas = response;
          setOpcoes(FornecedoresMapeadas);
        } else {
        }
      })
      .catch((error) => {});
  }, []);
  const { id } = useParams();
  const valorPago = watch("pagamento");
  const valorPagamento = watch("valorPago");

  const atualizarValor = async () => {
    setValue("pagamento", Number(valorPagamento) + Number(valorPago));
    setValue("valorPago", 0);
  };
  const fetchData = async () => {
    try {
      const data: IPedido | Error = await PedidosService.getById(Number(id));
      if (data instanceof Error) {
        return;
      }
      const dateObject = new Date(data.updatedAt);
      if (!isNaN(dateObject.getTime())) {
        const formattedDate = dateObject.toISOString().split("T")[0];
        setValue("idOrcamento", data.idOrcamento);
        setValue("pagamento", data.pagamento);
        setTipo(data.status.toString());
        setValue("updatedAt", formattedDate);
        console.log(data)
        setOrcamento(data.orcamento);
      } 
    } catch (error) {}
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PaginaBase
      titulo="Editar Pedido"
      barraDeFerramentas={
        <FerramentasDeDetalhes
          tipo="detalhes"
          pageState={pageState}
          setPaiState={setPageState}
          onClickSalvar={handleSubmit(createPedido)}
          onClickSalvarEFechar={handleSubmit(createPedidoFechar)}
          onClickCancelar={fetchData}
        />
      }>
      <Box component={"form"} onSubmit={handleSubmit(createPedido)}>
        <Box
          display={"flex"}
          margin={1}
          flexDirection={"column"}
          component={Paper}
          variant="outlined">
          <Grid container direction="column" padding={2} spacing={3}>
            <Grid container item direction="row" spacing={4}>
              <Grid item>
                <Typography>Infromações Básicas</Typography>
              </Grid>
            </Grid>
            <Grid container item direction="row" spacing={4}>
              <Grid item>
                <Typography>Alterar o Orçamento</Typography>
                <Autocomplete
                  disablePortal
                  {...register("idOrcamento")}
                  id="combo-box-demo"
                  options={opcoes}
                  getOptionLabel={(option) =>
                    option.id.toString() + " - " + option.cliente.nome ??
                    option.cliente.nomeFantasia ??
                    option.cliente.razaoSocial
                  }
                  value={
                    opcoes.find(
                      (option) => option.id === watch("idOrcamento")
                    ) || null
                  }
                  disabled={!isEditable}
                  sx={{ width: 225 }}
                  renderInput={(params) => <TextField {...params} />}
                  onChange={(_, value) => {
                    setValue("idOrcamento", value?.id);
                  }}
                />

                {errors.idOrcamento && (
                  <span>{errors.idOrcamento.message?.toString()}</span>
                )}
              </Grid>
              <Grid item>
                <InputLabel id="status">Status</InputLabel>
                <Select
                  labelId="status"
                  id="status"
                  value={tipo}
                  {...register("status")}
                  onChange={handleChange}>
                  <MenuItem value={"Pendente"} disabled={!isEditable}>
                    Pendente
                  </MenuItem>
                  <MenuItem value={"Em_Processo"} disabled={!isEditable}>
                    Em Processo
                  </MenuItem>
                  <MenuItem value={"Concluido"} disabled={!isEditable}>
                    Concluido
                  </MenuItem>
                </Select>

                {errors.status && (
                  <span>{errors.status.message?.toString()}</span>
                )}
              </Grid>
              <Grid item>
                <Typography>Valor Pago</Typography>
                <TextField
                  type="number"
                  disabled={!isEditable}
                  placeholder="Valor Pago"
                  {...register("pagamento")}
                />
                {errors.prazoEstimadoProducao && (
                  <span>
                    {errors.prazoEstimadoProducao.message?.toString()}
                  </span>
                )}
              </Grid>
              <Grid item>
                <Typography>Data ultima Alteração</Typography>
                <TextField
                  type="date"
                  placeholder="data"
                  disabled={true}
                  {...register("updatedAt")}
                  onChange={(e) => {
                    setValue("updatedAt", e.target.value);
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Box>
        <Box
          display={"flex"}
          margin={1}
          flexDirection={"column"}
          component={Paper}
          variant="outlined">
          <Grid container direction="column" padding={2} spacing={3}>
            <Grid container item direction="row" spacing={4}>
              <Grid item>
                <Typography>Informar valor pagamento</Typography>
              </Grid>
              <Grid container item direction="row" spacing={4}>
                <Grid item>
                  <Typography>Valor</Typography>
                  <TextField
                    disabled={!isEditable}
                    {...register("valorPago")}
                    type="number"
                  />
                </Grid>
                <Grid item>
                  <Typography>Adionar Valor Pago</Typography>
                  <Button
                    variant="contained"
                    size="large"
                    disabled={!isEditable}
                    onClick={() => {
                      atualizarValor();
                    }}>
                    Adicionar
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
        <Box
          display={"flex"}
          margin={1}
          flexDirection={"column"}
          component={Paper}
          variant="outlined">
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
