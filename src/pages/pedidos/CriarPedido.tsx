import { Autocomplete, Box, Grid, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { FerramentasDeDetalhes, TTipo } from "../../ui/components";
import { PaginaBase } from "../../ui/layouts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";
import React from "react";
import { IPedido, PedidosService } from "../../data/services/api/modules/pedidos";
import { useNavigate } from "react-router-dom";
import { IOrcamento, OrcamentosService } from "../../data/services/api/modules/orcamentos";



const createUserFormSchema = z.object({
  pagamento: z.coerce.number(),
  idOrcamento: z.coerce.number(),
  status: z.string(),
  
});


export const CriarPedido = () => {

  const navigate = useNavigate();
  function createPedido(data: any) {
    console.log(data)
    PedidosService.create(data)
      .then((result) => {
        console.log(result);
        navigate(-1);
      })
      .catch((error) => { console.log(error)});
  }

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createUserFormSchema),
  });

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
        console.log(response)
        if (response && Array.isArray(response)) {
          const FornecedoresMapeadas = response;
          setOpcoes(FornecedoresMapeadas);
        } else {
        }
      })
      .catch((error) => {});
  }, []);

  return (
    <PaginaBase
    titulo="Novo Pedido"
    barraDeFerramentas={
      <FerramentasDeDetalhes
        tipo="detalhes"
        pageState={pageState}
        setPaiState={setPageState}
        onClickSalvar={handleSubmit(createPedido)}
      />
    }
  >
   <Box component={"form"} onSubmit={handleSubmit(createPedido)}>
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
                <Typography>Selecione o Orçamento</Typography>
                <Autocomplete
                  disablePortal
                  {...register("idOrcamento")}
                  id="combo-box-demo"
                 
                  options={opcoes}
                  getOptionLabel={(option) =>
                    option.id.toString()+ " - "+ option.cliente.nome ?? option.cliente.nomeFantasia ?? option.cliente.razaoSocial
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
                  onChange={handleChange}
                >
                  <MenuItem value={"Pendente"} disabled={!isEditable}>Pendente</MenuItem>             
                  <MenuItem value={"Em Processo"} disabled={!isEditable}>Em Processo</MenuItem>
                  <MenuItem value={"Concluido"} disabled={!isEditable}>Concluido</MenuItem>
                </Select>

                {errors.status && (
                  <span>{errors.status.message?.toString()}</span>
                )}
              </Grid>
              <Grid item>
                <Typography>Valor Pago</Typography>
                <TextField
                  type="number" disabled={!isEditable}
                  placeholder="Valor Pago"
                  {...register("pagamento")}
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
