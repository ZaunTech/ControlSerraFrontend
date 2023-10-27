import React, { useEffect, useState } from "react";
import { PaginaBase } from "../../ui/layouts";
import { FerramentasDeDetalhes } from "../../ui/components";
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
import { OrcamentosService } from "../../data/services/api/modules/orcamentos";
import { useNavigate } from "react-router-dom";

const createUserFormSchema = z.object({
  idCliente: z.coerce.number(),
  observacoes: z.string(),
  dataOrcamento: z.coerce.date(),
  validade: z.coerce.date(),
  status: z.string(),
  prazoEstimadoProducao: z.coerce.number(),
});

export const CriarOrcamento = () => {
  const [opcoes, setOpcoes] = useState<ICliente[]>([]);

  useEffect(() => {
    ClientesService.getAll()
      .then((response) => {
        // Verifique se data é um array

        if (response instanceof Error) {
          console.error("Erro ao buscar categorias:", response);
          // Trate o erro conforme necessário, você pode querer mostrar uma mensagem de erro para o usuário
          return;
        }

        if (response && Array.isArray(response.data)) {
          const FornecedoresMapeadas = response.data;
          console.log(FornecedoresMapeadas);
          setOpcoes(FornecedoresMapeadas);
        } else {
          console.error(
            "A resposta não é uma array válida de categorias:",
            response
          );
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar categorias:", error);
      });
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createUserFormSchema),
  });
  const [tipo, setTipo] = React.useState("Pendente");
  const handleChange = (event: SelectChangeEvent) => {
    setTipo(event.target.value as string);
  };

  const navigate = useNavigate();
  function createOrcamento(data: any) {
    OrcamentosService.create(data)
      .then(() => {
        navigate(-1);
      })
      .catch(() => {});
  }

  return (
    <PaginaBase
      titulo="Criar Orcamento"
      barraDeFerramentas={
        <FerramentasDeDetalhes
          mostrarBotaoApagar={false}
          mostrarBotaoSalvar
          mostrarBotaoVoltar
          onClickSalvar={handleSubmit(createOrcamento)}
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
                <Typography>Selecione o Cliente</Typography>
                <Autocomplete
                  disablePortal
                  {...register("idCliente")}
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
                    setValue("idCliente", value?.id);
                  }}
                />

                {errors.idCliente && (
                  <span>{errors.idCliente.message?.toString()}</span>
                )}
              </Grid>
              <Grid item>
                <InputLabel id="tipo">Status</InputLabel>
                <Select
                  labelId="tipo"
                  id="tipo"
                  value={tipo}
                  {...register("status")}
                  onChange={handleChange}
                >
                  <MenuItem value={"Pendente"}>Pendente</MenuItem>
                  <MenuItem value={"Iniciado"}>Iniciado</MenuItem>
                  <MenuItem value={"Em Processo"}>Em Processo</MenuItem>
                  <MenuItem value={"Concluido"}>Concluido</MenuItem>
                </Select>

                {errors.contaTipo && (
                  <span>{errors.contaTipo.message?.toString()}</span>
                )}
              </Grid>
              <Grid item>
                <Typography>Data Orçamento</Typography>
                <TextField
                  type="date"
                  placeholder="data"
                  {...register("dataOrcamento")}
                  onChange={(e) => {
                    setValue("dataOrcamento", e.target.value);
                  }}
                />
                {errors.dataOrcamento && (
                  <span>{errors.dataOrcamento.message?.toString()}</span>
                )}
              </Grid>
              <Grid item>
                <Typography>Data de Validade</Typography>
                <TextField
                  type="date"
                  placeholder="data"
                  {...register("validade")}
                  onChange={(e) => {
                    setValue("validade", e.target.value);
                  }}
                />
                {errors.validade && (
                  <span>{errors.validade.message?.toString()}</span>
                )}
              </Grid>
              <Grid item>
                <Typography>Observações</Typography>
                <TextField
                  type="text"
                  placeholder="Observações"
                  {...register("observacoes")}
                />
                {errors.dataVec && (
                  <span>{errors.dataVec.message?.toString()}</span>
                )}
              </Grid>
              <Grid item>
                <Typography>Prazo Estimado em Dias</Typography>
                <TextField
                  type="number"
                  placeholder="Prazo Estimado em Dias"
                  {...register("prazoEstimadoProducao")}
                />
                {errors.prazoEstimadoProducao && (
                  <span>
                    {errors.prazoEstimadoProducao.message?.toString()}
                  </span>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </PaginaBase>
  );
};
