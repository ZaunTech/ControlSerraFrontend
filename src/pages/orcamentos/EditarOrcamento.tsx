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
import { useNavigate, useParams } from "react-router-dom";

const createUserFormSchema = z.object({
  idCliente: z.coerce.number(),
  observacoes: z.string(),
  status: z.string(),
  prazoEstimadoProducao: z.coerce.number(),
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
  const handleChange = (event: SelectChangeEvent) => {
    setTipo(event.target.value as string);
  };
  
  const setarOrcamento = async ()=>{ 
    try{
   await OrcamentosService.getById(Number(id)).then((result) => {
   if (result instanceof Error) {
     return;
   }

   setValue("idCliente", result.idCliente);
   setValue("observacoes", result.observacoes);
   setTipo(result.status.toString());
   setValue("status",result.status.toString())
   setValue("prazoEstimadoProducao", result.prazoEstimadoProducao);
 });
}
catch(error){}
}

  const { id } = useParams();
  const navigate = useNavigate();
  function createOrcamento(data: any) {
    OrcamentosService.updateById(Number(id), data)
      .then(() => {
        setIsEditable(false);
        setPageState("detalhes")
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
      titulo="Editar Orcamento"
      barraDeFerramentas={
        <FerramentasDeDetalhes
          tipo="detalhes"
          pageState={pageState}
          onClickSalvar={handleSubmit(createOrcamento)}
          setPaiState={setPageState}
          onClickSalvarEFechar={handleSubmit(createOrcamentoFechar)} 
          onClickCancelar={handleSubmit(setarOrcamento)}/>
          
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
                  disabled={!isEditable}
                  options={opcoes}
                  value={
                    opcoes.find((option) => option.id === watch("idCliente")) ||
                    null
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
                  type="text" disabled={!isEditable}
                  placeholder="Observações"
                  {...register("observacoes")}
                />
                {errors.observacoes && (
                  <span>{errors.observacoes.message?.toString()}</span>
                )}
              </Grid>
              <Grid item>
                <Typography>Prazo Estimado de produção (Dias) </Typography>
                <TextField
                  type="number" disabled={!isEditable}
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
