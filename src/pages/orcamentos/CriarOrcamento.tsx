import React, { useEffect, useState } from "react";
import { PaginaBase } from "../../ui/layouts";
import { FerramentasDeDetalhes } from "../../ui/components";
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
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { useFieldArray, useForm } from "react-hook-form";
import {
  IProduto,
  ProdutosService,
} from "../../data/services/api/modules/produtos";
import { IProdutoBase, ProdutosBaseService } from "../../data/services/api";

const createUserFormSchema = z.object({
  titulo: z.string(),

  observacao: z.string(),
  produtos: z.array(
    z.object({
      id: z.coerce.number(),
      quantidade: z.coerce.number(),
    })
  ),
});

function CriarOrcamento() {
  const [tipo, setTipo] = React.useState("1");
  const handleChange = (event: SelectChangeEvent) => {
    setTipo(event.target.value as string);
  };
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
  const { fields, append, remove } = useFieldArray({
    control,
    name: "produtos",
  });

  function addNovoProduto() {
    append({ titulo: "" });
  }

  const [opcoes, setOpcoes] = useState<IProdutoBase[]>([]);
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
          const produtosMapeadas = response.data;
          console.log(produtosMapeadas);
          setOpcoes(produtosMapeadas);
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

  return (
    <PaginaBase
      titulo="Criar Orcamento"
      barraDeFerramentas={
        <FerramentasDeDetalhes
          mostrarBotaoApagar={false}
          mostrarBotaoSalvar
          mostrarBotaoVoltar
        />
      }
    >
      <Box component={"form"}>
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
                <Typography>Cliente</Typography>
                <TextField placeholder="Cliente" />
              </Grid>
              <Grid item>
                <Typography>Observações</Typography>
                <TextField type="text" placeholder="Observações" />
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </PaginaBase>
  );
}

export default CriarOrcamento;
