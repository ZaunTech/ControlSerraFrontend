import { useEffect } from "react";
import { useState } from "react";
import { PaginaBase } from "../../../../ui/layouts";
import { FerramentasDeDetalhes, TTipo } from "../../../../ui/components";
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
} from "../../../../data/services/api";
import { CotacoesService } from "../../../../data/services/api/modules/cotacoes";
import { useNavigate, useParams } from "react-router-dom";
import { ListaInsumosService } from "../../../../data/services/api/modules/listaInsumos";
export const NovaCotacaoOrcamento = () => {
  const [opcoes, setOpcoes] = useState<IFornecedor[]>([]);

  const [opcaoiInsumos, setopcaoInsumo] = useState<IVariante[]>([]);

  const shemaCotacao = z.object({
    idFornecedor: z.number(),
    idVariante: z.number(),
    valor: z.coerce.number(),
   
    data: z.coerce.date(),
  });

  useEffect(() => {
    VariantesService.getAll({perPage:0})
      .then((response) => {
        if (response instanceof Error) {
          return;
        }
        console.log(response)

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

  const navigate = useNavigate();
  function createCotacao(data: any) {
    CotacoesService.create(data)
      .then(() => {
        navigate(-1);
      })
      .catch(() => { });
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

  const{ idItemListaInsumos  } = useParams();
  // Preencher o valor inicial ao montar o componente
  useEffect(() => {
    setValue('data', getCurrentDate());
    ListaInsumosService.getById(Number(idItemListaInsumos)).then((result)=>{
      setValue("idVariante", Number(result.idVariante));
    }).catch((erro)=>{
      console.log(erro)
    })

   

    
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
                <Box>
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
                </Box>

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
                  getOptionLabel={(opcaoiInsumos) => opcaoiInsumos.insumo.titulo ?? ""}
                  sx={{ width: 225 }}
                  value={
                    opcaoiInsumos.find(
                      (option) => option.id === watch("idVariante")
                    ) || null
                  }
                  disabled={true}
                  renderInput={(params) => <TextField {...params} />}
                  onChange={(_, value) => {
                    setValue("idVariante", value?.id);
                  }}
                />
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

export default NovaCotacaoOrcamento;
