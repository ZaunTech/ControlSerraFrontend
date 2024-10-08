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
import {
  IListaInsumo,
  ListaInsumosService,
} from "../../../../data/services/api/modules/listaInsumos";

const createUserFormSchema = z.object({
 
  quantidade: z.coerce.number().min(1,"Informe a quantidade"),
  idVariante: z.coerce.number().min(1,"Selecione o insumo"),
});

export const ItemListaInsumoProduto = () => {
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

  const [opcaoiInsumos, setopcaoInsumo] = useState<IVariante[]>([]);
  useEffect(() => {
    VariantesService.getAll()
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

  const fetchData = async () => {
    try {
      const data: IListaInsumo | Error = await ListaInsumosService.getById(
        Number(id)
      );
      if (data instanceof Error) {
        return;
      }
      setValue("idVariante", data.idVariante);
      setValue("quantidade", data.quantidade);
    
    } catch (error) {}
  };

  useEffect(() => {
    fetchData();
  }, []);

  function createInsumoProd(data: any) {
    ListaInsumosService.updateById(Number(id), data)
      .then((result) => {
        if (!(result instanceof Error)) {
          setIsEditable(false);
          setPageState("detalhes");
        }
      })
      .catch((error) => {});
  }
  function createInsumoProdFechar(data: any) {
    ListaInsumosService.updateById(Number(id), data)
      .then((result) => {
        if (!(result instanceof Error)) {
          navigate(-1);
        }
      })
      .catch((error) => {});
  }

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
      titulo="Editar Insumos do Produto" 
      barraDeFerramentas={
        <FerramentasDeDetalhes
          tipo="detalhes"
          setPaiState={setPageState}
          pageState={pageState}
          onClickSalvarEFechar={handleSubmit(createInsumoProdFechar)}
          onClickCancelar={fetchData}
          onClickSalvar={handleSubmit(createInsumoProd)}
        />
      }
    >
      <Box component={"form"} onSubmit={handleSubmit(createInsumoProd)}>
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
                <Box>
                <Typography>Selecione o Insumo</Typography>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  disabled={!isEditable}
                  {...register("idVariante")}
                  value={
                    opcaoiInsumos.find(
                      (opcaoiInsumos) => opcaoiInsumos.id === watch("idVariante")
                    ) || null
                  }
                  options={opcaoiInsumos}
                  getOptionLabel={(opcaoInsumo) => ` ${opcaoInsumo.insumo.titulo || ''}  -  ${opcaoInsumo.variante || ''}`}
                  sx={{ width: 225 }}
                  renderInput={(params) => <TextField {...params} />}
                  onChange={(_, value) => {
                    setValue("idVariante", value?.id);
                  }}
                />
                </Box>
                {errors.idVariante && (
                  <span>{errors.idVariante.message?.toString()}</span>
                )}
              </Grid>
              <Grid item>
                <Box>
                <Typography>Quantidade</Typography>
                <TextField disabled={!isEditable}
                  type="number"
                  placeholder="Quantidade"
                  {...register("quantidade")}
                />
                </Box>
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
