import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import { useMemo } from "react";
import { PaginaBase } from "../../ui/layouts";
import {
  FerramentasDaListagem,
  FerramentasDeDetalhes,
} from "../../ui/components";
import {
  Autocomplete,
  Box,
  FormControl,
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



function Cotacao() {
  const [opcoes, setOpcoes] = useState<IFornecedor[]>([]);
  const [fornecedor, setFornecedor] = useState<IFornecedor>();
  const [insumo, setInsumo] = useState<IInsumo>();

  const [opcaoiInsumos, setopcaoInsumo] = useState<IInsumo[]>([]);

  const shemaCotacao = z.object({
    idFornecedor: z.number(),
    idInsumo: z.number(),
    valor: z.coerce.number(),
    dimensoes: z.string(),
    data: z.coerce.date(),
  });

  useEffect(() => {
    InsumosService.getAll()
      .then((response) => {
        // Verifique se data é um array
        console.log("Resposta do serviço:", response);
        if (response instanceof Error) {
          console.error("Erro ao buscar categorias:", response);
          // Trate o erro conforme necessário, você pode querer mostrar uma mensagem de erro para o usuário
          return;
        }

        if (response && Array.isArray(response.data)) {
          const InsumosMapeadas = response.data;
          console.log(InsumosMapeadas);
          setopcaoInsumo(InsumosMapeadas);
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

  useEffect(() => {
    FornecedoresService.getAll()
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
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(shemaCotacao),
  });
  const { id } = useParams();

  useEffect(()=>{

    const fetchData = async () => {
      try {
        const data: ICotacao | Error = await CotacoesService.getById(Number(id));
        if(data instanceof Error){
          return;
        }
       
        const dateObject = new Date(data.data);
      if (!isNaN(dateObject.getTime())) {
        // Convert the date to a string in the "YYYY-MM-DD" format
        const formattedDate = dateObject.toISOString().split('T')[0];

        setValue("idInsumo", data.idInsumo);
        setValue("idFornecedor", data.idFornecedor);
        setValue("data", formattedDate);
        setValue("dimensoes", data.dimensoes);
        setValue("valor", data.valor);
      } else {
        console.error('Invalid date format:', data.data);
      }
        // Do something with the 'data' here
      } catch (error) {
        // Handle errors here
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  },[])

  const navigate = useNavigate();
  function createCotacao(data: any) {
    CotacoesService.updateById(Number(id),data)
      .then(() => {
        navigate(-1);
      })
      .catch(() => {
        console.log("Deu Erro");
      });
  }

  return (
    <PaginaBase
      titulo="Editar Cotação"
      barraDeFerramentas={
        <FerramentasDeDetalhes
          mostrarBotaoApagar={false}
          mostrarBotaoSalvar
          mostrarBotaoVoltar
          onClickSalvar={handleSubmit(createCotacao)}
        />
      }>
      <Box component={"form"} onSubmit={handleSubmit(createCotacao)}>
        <Box
          display={"flex"}
          margin={1}
          flexDirection={"column"}
          component={Paper}
          variant="outlined">
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
                  value={opcoes.find((option) => option.id === watch("idFornecedor")) || null}
                  getOptionLabel={(option) =>
                    option.nomeFantasia ?? option.nome ?? option.razaoSocial ?? ""
                  }
                  sx={{ width: 225 }}
                  renderInput={(params) => <TextField {...params} />}
                  onChange={(_, value) => {
                    setFornecedor(value ?? undefined);
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
          variant="outlined">
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
                  value={opcaoiInsumos.find((option) => option.id === watch("idInsumo")) || null}
                  sx={{ width: 225 }}
                  renderInput={(params) => <TextField {...params} />}
                  onChange={(_, value) => {
                    setInsumo(value ?? undefined);
                    setValue("idInsumo", value?.id);
                  }}
                />
                {errors.idInsumo && (
                  <span>{errors.idInsumo.message?.toString()}</span>
                )}
              </Grid>

              <Grid item>
                <Typography>Dimensões</Typography>
                <TextField placeholder="Dimensões" {...register("dimensoes")} />
                {errors.dimensoes && (
                  <span>{errors.dimensoes.message?.toString()}</span>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </PaginaBase>
  );
}

export default Cotacao;
