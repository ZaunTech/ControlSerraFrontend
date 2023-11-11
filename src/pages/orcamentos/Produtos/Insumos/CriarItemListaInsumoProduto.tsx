import { useEffect, useState } from "react";
import { FerramentasDeDetalhes, TTipo } from "../../../../ui/components";
import { PaginaBase } from "../../../../ui/layouts";
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
import { IInsumo, IVariante, InsumosService, VariantesService } from "../../../../data/services/api";
import { useNavigate, useParams } from "react-router-dom";
import { ListaInsumosService } from "../../../../data/services/api/modules/listaInsumos";

const createUserFormSchema = z.object({
  idProduto: z.coerce.number(),
  quantidade: z.coerce.number(),
  idVariante: z.coerce.number(),

});

export const CriarItemInsumoProdutoBase = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createUserFormSchema),
  });

  const [opcaoiInsumos, setopcaoInsumo] = useState<IVariante[]>([]);
  useEffect(() => {
    VariantesService.getAll({perPage:0})
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
    setValue("idProduto", Number(id));
  });

  function createUser(data: any) {
    console.log(data);
    ListaInsumosService.create(data)
      .then((result) => {
        if (!(result instanceof Error)) {
          navigate(-1);
        }
        console.log(result);
      })
      .catch((error) => {});
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
      titulo="Adicionar Insumos Produto"
      barraDeFerramentas={
        <FerramentasDeDetalhes
          tipo="novo"
          pageState={pageState}
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
            <Grid container item direction="row" spacing={4}>
              <Grid item>
                <Typography>Selecione o Insumo</Typography>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  {...register("idVariante")}
                  options={opcaoiInsumos}
                  getOptionLabel={(opcaoInsumo) => ` ${opcaoInsumo.insumo.titulo || ''}  -  ${opcaoInsumo.variante || ''}`}
                  sx={{ width: 225 }}
                  
                  renderInput={(params) => <TextField {...params} />}
                  onChange={(_, value) => {
                    setValue("idVariante", value?.id);
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
            
            </Grid>
          </Grid>
        </Box>
      </Box>
    </PaginaBase>
  );
};
