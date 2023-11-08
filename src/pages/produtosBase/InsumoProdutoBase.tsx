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
import { IInsumo, InsumosService } from "../../data/services/api";
import { IInsumosProdutoBase, InsumosProdutoBaseService } from "../../data/services/api/modules/insumosProdutoBase";
import { useNavigate, useParams } from "react-router-dom";

const createUserFormSchema = z.object({
  idProdutoBase: z.coerce.number(),
  quantidade: z.coerce.number(),
  idInsumo: z.coerce.number(),
  unidade: z.string(),
});

export const InsumoProdutoBase = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
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
  

  useEffect(() => {
    setValue("idProdutoBase", Number(id));
  });
  const {id} = useParams();
    const fetchData = async () => {
      try {
        const data: IInsumosProdutoBase | Error = await InsumosProdutoBaseService.getById(Number(id));
        if (data instanceof Error) {
          return;
        }
        setValue("idInsumo", data.idInsumo);
        setValue("quantidade", data.quantidade);
        setValue("unidade", data.unidade);
        
      
      } catch (error) {}
    };

  function editarInsumo(data: any) {
    InsumosProdutoBaseService.updateById(Number(id),data)
      .then((result) => {
        if (!(result instanceof Error)) {
          setIsEditable(false)
          setPageState("detalhes")
        }
      })
      .catch((error) => {});
  }
  function editarInsumoEFechar(data: any) {
    InsumosProdutoBaseService.updateById(Number(id),data)
      .then((result) => {
        if (!(result instanceof Error)) {
          navigate(-1);
        }
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

  useEffect(()=>{
    fetchData()
  },[])


  return (
    <PaginaBase
      titulo="Editar Insumos base"
      barraDeFerramentas={
        <FerramentasDeDetalhes
          tipo="detalhes"
          pageState={pageState}
        
          setPaiState={setPageState}
          onClickSalvar={handleSubmit(editarInsumo)}
          onClickSalvarEFechar={handleSubmit(editarInsumoEFechar)}
          onClickCancelar={fetchData}
        />
      }
    >
      <Box component={"form"} onSubmit={handleSubmit(editarInsumo)}>
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
                  disabled={!isEditable}
                  id="combo-box-demo"
                  {...register("idInsumo")}
                  options={opcaoiInsumos}
                  getOptionLabel={(opcaoiInsumos) => opcaoiInsumos.titulo ?? ""}
                  sx={{ width: 225 }}
                  value={
                    opcaoiInsumos.find(
                      (option) => option.id === watch("idInsumo")
                    ) || null
                  }
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
                  type="number" disabled={!isEditable}
                  placeholder="Quantidade"
                  {...register("quantidade")}
                />
                {errors.quantidade && (
                  <span>{errors.quantidade.message?.toString()}</span>
                )}
              </Grid>
              <Grid item>
                <Typography>unidade</Typography>
                <TextField placeholder="unidade" disabled={!isEditable} {...register("unidade")} />
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
