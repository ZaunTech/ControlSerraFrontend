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
import { IInsumo, InsumosService } from "../../data/services/api";
import { useNavigate, useParams } from "react-router-dom";
import {
  IListaInsumo,
  ListaInsumosService,
} from "../../data/services/api/modules/listaInsumos";

const createUserFormSchema = z.object({
  quantidade: z.coerce.number(),
  idInsumo: z.coerce.number(),
  dimensoes: z.string(),
});

export const ItemListaInsumoProdutoBase = () => {
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

  const [opcaoiInsumos, setopcaoInsumo] = useState<IInsumo[]>([]);
  useEffect(() => {
    InsumosService.getAll()
      .then((response) => {
        if (response instanceof Error) {
          return;
        }

        if (response && Array.isArray(response.data)) {
          const InsumosMapeadas = response.data;
          setopcaoInsumo(InsumosMapeadas);
        } else {
        }
      })
      .catch((error) => {});
  }, []);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: IListaInsumo | Error = await ListaInsumosService.getById(
          Number(id)
        );
        if (data instanceof Error) {
          return;
        }
        setValue("idInsumo", data.idInsumo);
        setValue("quantidade", data.quantidade);
        setValue("dimensoes", data.dimensoes);
      } catch (error) {}
    };

    fetchData();
  }, []);

  function createUser(data: any) {
    ListaInsumosService.updateById(Number(id), data)
      .then((result) => {
        if (!(result instanceof Error)) {
          navigate(-1);
        }
      })
      .catch((error) => {});
  }

  return (
    <PaginaBase
      titulo="Editar Insumos"
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
                <Typography>Selecione o Insumo</Typography>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  {...register("idInsumo")}
                  value={
                    opcaoiInsumos.find(
                      (opcaoiInsumos) => opcaoiInsumos.id === watch("idInsumo")
                    ) || null
                  }
                  options={opcaoiInsumos}
                  getOptionLabel={(opcaoiInsumos) => opcaoiInsumos.titulo ?? ""}
                  sx={{ width: 225 }}
                  renderInput={(params) => <TextField {...params} />}
                  onChange={(_, value) => {
                    setValue("idInsumo", value?.id);
                  }}
                />
                {errors.idInsumo && (
                  <span>{errors.idInsumo.message?.toString()}</span>
                )}
              </Grid>
              <Grid item>
                <Typography>Quantidade</Typography>
                <TextField
                  type="number"
                  placeholder="Quantidade"
                  {...register("quantidade")}
                />
                {errors.quantidade && (
                  <span>{errors.quantidade.message?.toString()}</span>
                )}
              </Grid>
              <Grid item>
                <Typography>Dimensões</Typography>
                <TextField placeholder="Dimensões" {...register("dimensoes")} />
                {errors.dimensoes && (
                  <span>{errors.dimensoes.message?.toString()}</span>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </PaginaBase>
  );
};
