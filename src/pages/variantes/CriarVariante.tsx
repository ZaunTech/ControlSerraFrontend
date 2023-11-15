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
import { useNavigate, useParams } from "react-router-dom";

const createUserFormSchema = z.object({
 
  idInsumo: z.coerce.number(),
  variante: z.string().min(1,"Informe a variação"),
  
});

export const CriarVariante = () => {
  const { register, handleSubmit, setValue,watch, formState: { errors }, } = useForm({
    resolver: zodResolver(createUserFormSchema),
  });
  const navigate = useNavigate();
  function createUser(data: any) {
    VariantesService.create(data)
      .then(() => {
    
        navigate(-1);
      })
      .catch((erro) => { console.log(erro) });
  }
  const [opcoes, setOpcoes] = useState<IInsumo[]>([]);

  const {id} = useParams();
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
      console.log(id)
      setValue("idInsumo",id)
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
                <Box>
                <Typography>Variante</Typography>
                <TextField   {...register("variante")}   />
                </Box>
                {errors.variante && <span>{errors.variante.message?.toString()}</span>}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </PaginaBase>
  );
};
