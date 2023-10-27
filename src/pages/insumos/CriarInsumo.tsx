import { useEffect, useState } from "react";
import { FerramentasDeDetalhes } from "../../ui/components";
import { PaginaBase } from "../../ui/layouts";
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
  CategoriasService,
  ICategoria,
  InsumosService,
} from "../../data/services/api";
import { useNavigate } from "react-router-dom";

const createUserFormSchema = z.object({
  titulo: z.string().min(1, "Preencha o Titulo"),
  idCategoria: z.coerce.number().optional(),
  descricao: z.string(),
  unidadeMedida: z.string(),
});

export const CriarInsumo = () => {
  const { register, handleSubmit, setValue } = useForm({
    resolver: zodResolver(createUserFormSchema),
  });
  const navigate = useNavigate();
  function createUser(data: any) {
    InsumosService.create(data)
      .then(() => {
        navigate(-1);
      })
      .catch((erro) => {});
  }
  const [opcoes, setOpcoes] = useState<ICategoria[]>([]);

  useEffect(() => {
    CategoriasService.getAll()
      .then((response) => {
        if (response instanceof Error) {
          return;
        }

        if (response && Array.isArray(response.data)) {
          const categoriasMapeadas = response.data;
          setOpcoes(categoriasMapeadas);
        } else {
        }
      })
      .catch((error) => {});
  }, []);

  return (
    <PaginaBase
      titulo="Novo Insumo"
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
            <Grid container item direction="column" spacing={4}>
              <Grid item>
                <Typography>Titulo</Typography>
                <TextField placeholder="Titulo" {...register("titulo")} />
              </Grid>
              <Grid item>
                <Typography>Categoria</Typography>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={opcoes}
                  getOptionLabel={(option) => option.titulo}
                  sx={{ width: 225 }}
                  renderInput={(params) => <TextField {...params} />}
                  onChange={(_, value) => {
                    if (value !== null) {
                      setValue("categoria", [value]);
                      setValue("idCategoria", value.id);
                    }
                  }}
                />
              </Grid>
              <Grid item>
                <Typography>Descrição</Typography>
                <TextField placeholder="Descrição" {...register("descricao")} />
              </Grid>
              <Grid item>
                <Typography>Unidade de Medida</Typography>
                <TextField
                  placeholder="Unidade de Medida"
                  {...register("unidadeMedida")}
                />
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </PaginaBase>
  );
};
