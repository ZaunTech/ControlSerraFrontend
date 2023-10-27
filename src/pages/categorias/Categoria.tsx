import React, { useEffect } from "react";
import { PaginaBase } from "../../ui/layouts";
import { FerramentasDeDetalhes } from "../../ui/components";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategoriasService, ICategoria } from "../../data/services/api";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";

const createUserFormSchema = z.object({
  titulo: z.string().min(1, "Preencha esta campo"),
  descricao: z.string(),
  tipo: z.string(),
});

export const Categoria = () => {
  const [tipo, setTipo] = React.useState("Mão de Obra");
  const handleChange = (event: SelectChangeEvent) => {
    setTipo(event.target.value as string);
  };
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createUserFormSchema),
  });
  const { id } = useParams();
  const navigate = useNavigate();
  function createUser(data: any) {
    CategoriasService.updateById(Number(id), data)
      .then(() => {
        navigate(-1);
      })
      .catch((erro) => {});
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: ICategoria | Error = await CategoriasService.getById(
          Number(id)
        );
        if (data instanceof Error) {
          return;
        }
        setValue("titulo", data.titulo);
        setValue("descricao", data.descricao);
        setTipo(data.tipo);
      } catch (error) {
      }
    };

    fetchData();
  }, []);

  return (
    <PaginaBase
      titulo="Criar Categoria"
      barraDeFerramentas={
        <FerramentasDeDetalhes
          mostrarBotaoApagar={false}
          mostrarBotaoSalvar
          mostrarBotaoVoltar
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
                {errors.titulo && (
                  <span>{errors.titulo.message?.toString()}</span>
                )}
              </Grid>
              <Grid item>
                <InputLabel id="tipo">Tipo</InputLabel>
                <Select
                  labelId="tipo"
                  id="tipo"
                  value={tipo}
                  {...register("tipo")}
                  onChange={handleChange}
                >
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

export default Categoria;
