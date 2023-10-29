import {
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
import React, { useEffect, useRef, useState } from "react";
import { PaginaBase } from "../../ui/layouts";
import {
  FerramentasDeDetalhes,
  IFerramentasDeDetalhes,
  TTipo,
} from "../../ui/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CategoriasService } from "../../data/services/api";
import { useNavigate } from "react-router-dom";

const createUserFormSchema = z.object({
  titulo: z.string().min(1, "Preencha esta campo"),
  descricao: z.string(),
  tipo: z.string(),
});

export const CriarCategoria = () => {
  const [tipo, setTipo] = React.useState("Mão de Obra");
  const handleChange = (event: SelectChangeEvent) => {
    setTipo(event.target.value as string);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createUserFormSchema),
  });
  const navigate = useNavigate();

  function createUser(data: any) {
    CategoriasService.create(data)
      .then(() => {
        navigate(-1);
      })
      .catch((erro) => {});
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
      titulo="Nova Categoria"
      barraDeFerramentas={
        <FerramentasDeDetalhes
          tipo="novo"
          setPaiState={setPageState}
          onClickSalvar={handleSubmit(createUser)}
        />
      }>
      <Box component={"form"} onSubmit={handleSubmit(createUser)}>
        <Box
          display={"flex"}
          margin={1}
          flexDirection={"column"}
          component={Paper}
          variant="outlined">
          <Grid container direction="column" padding={2} spacing={3}>
            <Grid container item direction="column" spacing={4}>
              <Grid item>
                <Typography>Titulo</Typography>
                <TextField placeholder="Titulo" {...register("titulo")} />
              </Grid>
              <Grid item xs={6}>
                <InputLabel id="tipo">Tipo</InputLabel>
                <Select
                  labelId="tipo"
                  id="tipo"
                  value={tipo}
                  {...register("tipo")}
                  onChange={handleChange}>
                  <MenuItem value={"Mão de Obra"}>Mão de Obra</MenuItem>
                  <MenuItem value={"Insumo"}>Insumo</MenuItem>
                </Select>

                {errors.contaTipo && (
                  <span>{errors.contaTipo.message?.toString()}</span>
                )}
              </Grid>
              <Grid item>
                <Typography>Descricao</Typography>
                <TextField placeholder="Descrição" {...register("descricao")} />
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </PaginaBase>
  );
};
