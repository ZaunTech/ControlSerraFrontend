import { useEffect, useState } from "react";
import { FerramentasDeDetalhes, TTipo } from "../../ui/components";
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
  IInsumo,
  InsumosService,
  VariantesService,
} from "../../data/services/api";
import { useNavigate } from "react-router-dom";

const createUserFormSchema = z.object({
 
  idInsumo: z.coerce.number(),
  variante: z.string(),
  
});

export const CriarVariante = () => {
  const { register, handleSubmit, setValue } = useForm({
    resolver: zodResolver(createUserFormSchema),
  });
  const navigate = useNavigate();
  function createUser(data: any) {
    VariantesService.create(data)
      .then(() => {
        navigate(-1);
      })
      .catch((erro) => { });
  }
  const [opcoes, setOpcoes] = useState<IInsumo[]>([]);

  useEffect(() => {
    InsumosService.getAll({ perPage: 0 })
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
      .catch((error) => { });
  }, []);

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
      titulo="Nova Variante"
      barraDeFerramentas={
        <FerramentasDeDetalhes
          tipo="novo"
          pageState={pageState}
          setPaiState={setPageState}
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
                <Typography>Insumow</Typography>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={opcoes}
                  getOptionLabel={(option) => option.titulo}
                  sx={{ width: 225 }}
                  disabled={!isEditable}
                  renderInput={(params) => <TextField {...params} />}
                  onChange={(_, value) => {
                    if (value !== null) {

                      setValue("idInsumo", value.id);
                    }
                  }}
                />
              </Grid>
              <Grid item>
                <Typography>Variante</Typography>
                <TextField   {...register("variante")}   />
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </PaginaBase>
  );
};
