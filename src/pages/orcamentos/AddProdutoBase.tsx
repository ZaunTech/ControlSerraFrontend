import React, { useEffect, useState } from "react";
import { FerramentasDeDetalhes } from "../../ui/components";
import { PaginaBase } from "../../ui/layouts";
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { useFieldArray, useForm } from "react-hook-form";
import {
  IInsumo,
  IProdutoBase,
  InsumosService,
  ProdutosBaseService,
  TListInsumos,
} from "../../data/services/api";
import {
  IInsumosProdutoBase,
  
  InsumosProdutoBaseService,
} from "../../data/services/api/modules/insumosProdutoBase";
import { useNavigate, useParams } from "react-router-dom";
import { setTimeout } from "timers/promises";
import { ProdutosService } from "../../data/services/api/modules/produtos";
import { ListaInsumosService } from "../../data/services/api/modules/listaInsumos";

const createUserFormSchema = z.object({
  titulo: z.string(),
  quantidade: z.coerce.number(),
  orcamentoId: z.coerce.number(),
  observacoes: z.string(),
});

function AddProdutoBase() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,

    formState: { errors },
  } = useForm({
    resolver: zodResolver(createUserFormSchema),
  });

  
  const [opcaoiInsumos, setopcaoInsumo] = useState<IProdutoBase[]>([]);
  const [opcaoSelecionada, setOpcao] = useState<IProdutoBase>();

  useEffect(() => {
    ProdutosBaseService.getAll()
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

  const {id} = useParams();
  useEffect(()=>{

    setValue("orcamentoId",id);
  },[])
  const navigate = useNavigate();
  const [insumosProdutoBase,setInsumosProdutoBase] = useState<IInsumosProdutoBase[]>([]);

  function createUser(data: any) {
    ProdutosService.create(data)
      .then((result) => {
        if (!(result instanceof Error)) {          
        }
      })
      .catch((error) => {
        console.error("Erro ao criar ProdutosBase:", error);
       
      });
  }

  return (
    <PaginaBase
      titulo="Criar Produto"
      barraDeFerramentas={
        <FerramentasDeDetalhes
          mostrarBotaoApagar={false}
          onClickSalvar={handleSubmit(createUser)}
        />
      }
    >
      <Box component={"form"} onSubmit={handleSubmit(createUser)}>
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
                <Typography>Selecione o Produto</Typography>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  {...register("idInsumo")}
                  options={opcaoiInsumos}
                  getOptionLabel={(opcaoiInsumos) => opcaoiInsumos.titulo ?? ""}
                  sx={{ width: 225 }}
                  renderInput={(params) => <TextField {...params} />}
                  onChange={(_, value) => {
                    setOpcao(value === null ? undefined : value) ;
                    setValue("titulo",value?.titulo);
                  }}
                />
                {errors.idInsumo && (
                  <span>{errors.idInsumo.message?.toString()}</span>
                )}
              </Grid>

              <Grid item>
                <Typography>Observações</Typography>
                <TextField
                  placeholder="Observações"
                  {...register("observacoes")}
                />
                {errors.observacao && (
                  <span>{errors.observacao.message?.toString()}</span>
                )}
              </Grid>
              <Grid item>
                <Typography>Quantidade</Typography>
                <TextField
                  placeholder="Quantidade"
                  {...register("quantidade")}
                />
                {errors.quantidade && (
                  <span>{errors.quantidade.message?.toString()}</span>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </PaginaBase>
  );
}

export default AddProdutoBase;
