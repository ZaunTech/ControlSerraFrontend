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
  IVariante,
  InsumosService,
  VariantesService,
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
  variante: z.string().min(1, "Informe a variação"),
  idInsumo: z.coerce.number(),
 
});

export const Variante = () => {
  const { idVariante } = useParams();

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
    VariantesService.updateById(Number(idVariante), data)
      .then(() => {
        setPageState("detalhes")
        setIsEditable(false)
      })
      .catch((error) => {});
  }

  
  function createInsumoFechar(data: any) {
 
    VariantesService.updateById(Number(idVariante), data)
      .then(() => {
        navigate(-1);
      })
      .catch((error) => {});
  }
  const [opcoes, setOpcoes] = useState<IInsumo[]>([]);

  useEffect(() => {
    InsumosService.getAll({perPage:0})
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

  const fetchData = async () => {
    try {
      const data: IVariante | Error = await VariantesService.getById(Number(idVariante));
      if (data instanceof Error) {
        return;
      }
      setValue("idInsumo", data.idInsumo);
   
      setValue("variante", data.variante);
      
    } catch (error) {}
  };
  useEffect(() => {
    fetchData();
  }, []);
  const [pageState, setPageState] = useState<TTipo>("detalhes");
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
      titulo="Variante"
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
                <Box>
                <Typography>Variante</Typography>
                <TextField  disabled={!isEditable}  {...register("variante")}   />
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
