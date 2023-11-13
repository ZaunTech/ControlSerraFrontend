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
import { OrcamentosService } from "../../data/services/api/modules/orcamentos";
import { useNavigate } from "react-router-dom";

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const createUserFormSchema = z.object({
  idCliente: z.coerce.number().min(1,"Selecione o cliente"),
  observacoes: z.string().optional(),
  status: z.string(),
  validade: z.coerce.date().min( new Date(getCurrentDate()),"Informe uma data valida"),
  prazoEstimadoProducao: z.coerce.number().min(1,"Digite um prazo estimado"),
});


export const CriarOrcamento = () => {
  const [opcoes, setOpcoes] = useState<ICliente[]>([]);

  useEffect(() => {
    setValue("validade",getCurrentDate())
    ClientesService.getAll({perPage:0})
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
    resolver: zodResolver(createUserFormSchema),
  });
  const [tipo, setTipo] = React.useState("Pendente");
  const handleChange = (event: SelectChangeEvent) => {
    setTipo(event.target.value as string);
  };

  const navigate = useNavigate();
  function createOrcamento(data: any) {
    console.log(data)
    OrcamentosService.create(data)
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
  

  return (
    <PaginaBase
      titulo="Novo Orcamento"
      barraDeFerramentas={
        <FerramentasDeDetalhes
          tipo="detalhes"
          pageState={pageState}
          setPaiState={setPageState}
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
                <Box>
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
                  disabled={!isEditable}
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
                >
                  <MenuItem value={"Pendente"} disabled={!isEditable}>Pendente</MenuItem>             
                  <MenuItem value={"Em Processo"} disabled={!isEditable}>Em Processo</MenuItem>
                  <MenuItem value={"Concluido"} disabled={!isEditable}>Concluido</MenuItem>
                </Select>

                {errors.contaTipo && (
                  <span>{errors.contaTipo.message?.toString()}</span>
                )}
              </Grid>
              
              <Grid item>
                <Typography>Observações</Typography>
                <TextField
                  type="text"
                  placeholder="Observações" disabled={!isEditable}
                  {...register("observacoes")}
                />
                {errors.dataVec && (
                  <span>{errors.dataVec.message?.toString()}</span>
                )}
              </Grid>
              <Grid item>
                <Box>
                <Typography>Data de Validade </Typography>
                <TextField
                  type="date" disabled={!isEditable}
                  placeholder="Data de Validade"
                  {...register("validade")}
                />
                </Box>
                {errors.validade && (
                  <span>
                    {errors.validade.message?.toString()}
                  </span>
                )}
              </Grid>
              <Grid item>
                <Box>
                <Typography>Prazo Estimado de produção (Dias) </Typography>
                <TextField
                  type="number" disabled={!isEditable}
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
      </Box>
    </PaginaBase>
  );
};
