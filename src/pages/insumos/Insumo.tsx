import { useEffect, useState } from "react";
import { PaginaBase } from "../../ui/layouts";
import { FerramentasDeDetalhes, TTipo } from "../../ui/components";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CategoriasService,
  ICategoria,
  IInsumo,
  InsumosService,
} from "../../data/services/api";
import { z } from "zod";
import {
  Autocomplete,
  Box,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

const createUserFormSchema = z.object({
  titulo: z.string().min(1, "Preencha o Titulo"),
  idCategoria: z.coerce.number(),
  descricao: z.string(),
  unidadeMedida: z.string(),
});

export const Insumo = () => {
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    setValue,
    watch,

    formState: { errors },
  } = useForm({
    resolver: zodResolver(createUserFormSchema),
  });

  const navigate = useNavigate();
  function createInsumo(data: any) {
    InsumosService.updateById(Number(id), data)
      .then(() => {
        navigate(-1);
      })
      .catch((error) => {  console.log(error);} );
  }
  function createInsumoFechar(data: any) {
    InsumosService.updateById(Number(id), data)
      .then(() => {
        navigate(-1);
      })
      .catch((error) => {console.log(error);});
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
      .catch((error) => { console.log(error);});
  }, []);

  const fetchData = async () => {
    try {
      const data: IInsumo | Error = await InsumosService.getById(Number(id));
      if (data instanceof Error) {
        return;
      }
      setValue("titulo", data.titulo);
      setValue("descricao", data.descricao);
      setValue("unidadeMedida", data.unidadeMedida);
      setValue("idCategoria", data.idCategoria);
    } catch (error) {}
  };
  useEffect(() => {
    fetchData();
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
      titulo="Insumos"
      barraDeFerramentas={
        <FerramentasDeDetalhes
          tipo="detalhes"
          setPaiState={setPageState}
          onClickSalvarEFechar={handleSubmit(createInsumoFechar)}
          onClickSalvar={handleSubmit(createInsumo)}
          onClickCancelar={fetchData}
        />
      }
    >
      <Box component={"form"} onSubmit={handleSubmit(createInsumo)}>
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
                <TextField placeholder="Titulo" disabled={!isEditable} {...register("titulo")} />
                {errors.titulo && (
                  <span>{errors.titulo.message?.toString()}</span>
                )}
              </Grid>

              <Grid item>
                <Typography>Categoria</Typography>
                <Autocomplete
                disabled={!isEditable}
                  disablePortal
                  id="combo-box-demo"
                  options={opcoes}
                  getOptionLabel={(option) => option.titulo}
                  sx={{ width: 225 }}
                  renderInput={(params) => <TextField {...params} />}
                  value={
                    opcoes.find(
                      (option) => option.id === watch("idCategoria")
                    ) || null
                  }
                  onChange={(_, value) => {
                    if (value !== null) {
                      setValue("categoria", [value]);
                      setValue("idCategoria", value.id);
                    }
                  }}
                />
                {errors.idCategoria && (
                  <span>{errors.idCategoria.message?.toString()}</span>
                )}
              </Grid>
              <Grid item>
                <Typography>Descrição</Typography>
                <TextField placeholder="Descrição" disabled={!isEditable} {...register("descricao")} />
                {errors.descricao && (
                  <span>{errors.descricao.message?.toString()}</span>
                )}
              </Grid>
              <Grid item>
                <Typography>Unidade de Medida</Typography>
                <TextField
                  placeholder="Unidade de Medida" disabled={!isEditable}
                  {...register("unidadeMedida")}
                />
                {errors.unidadeMedida && (
                  <span>{errors.unidadeMedida.message?.toString()}</span>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </PaginaBase>
  );
};
