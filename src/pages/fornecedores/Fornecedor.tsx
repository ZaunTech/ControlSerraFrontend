import { zodResolver } from "@hookform/resolvers/zod";
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
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import getCepData from "../../data/services/api/axios-config/actions/cep";
import { FornecedoresService, IFornecedor } from "../../data/services/api";
import { FerramentasDeDetalhes, TTipo } from "../../ui/components";
import { PaginaBase } from "../../ui/layouts";
import { useNavigate, useParams } from "react-router-dom";

const createUserFormSchema = z
  .object({
    razaoSocial: z.string().optional(),
    nomeFantasia: z.string().optional(),
    cnpj: z.string().optional(),
    rg: z.string().optional(),
    cpf: z.string().optional(),
    nome: z.string().optional(),
    contaTipo: z.string(),
    email: z.string().min(1, "Faltou o nome").email("isso não é email"),
    telefone: z.string().refine((value) => /^\d+$/.test(value), {
      message: "Por favor, insira apenas números para o telefone",
    }),
    cep: z.string().min(8),
    pais: z.string(),
    estado: z.string(),
    cidade: z.string(),
    bairro: z.string(),
    rua: z.string(),
    numero: z.string().optional(),
    complemento: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.contaTipo === "Juridica") {
        return data.cnpj !== "" && data.nomeFantasia !== "";
      }
      return true;
    },
    {
      message: "Campos obrigatórios para tipo de conta jurídica",
    }
  )
  .refine(
    (data) => {
      if (data.contaTipo === "Fisica") {
        return data.nome !== "" && data.rg !== "" && data.cpf !== "";
      }
      return true;
    },
    {
      message: "Campos obrigatórios para tipo de conta Fisica",
    }
  );

const createCepFormSchema = z.object({
  cep: z.coerce.number().min(8),
  pais: z.string(),
  estado: z.string(),
  cidade: z.string(),
  bairro: z.string(),
  rua: z.string(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
});

export const Fornecedor = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createUserFormSchema),
  });

  const [tipo, setTipo] = React.useState("Juridica");
  const handleChange = (event: SelectChangeEvent) => {
    setTipo(event.target.value as string);
    setValue("nome", undefined);
    setValue("nomeFantasia", undefined);
    setValue("rg", undefined);
    setValue("cpf", undefined);
    setValue("cnpj", undefined);
    setValue("razaoSocial", undefined);
  };

  const handleSetFormData = useCallback(
    (viacepResponse: IViacepResponse) => {
      setValue("pais", "Brasil");
      setValue("estado", viacepResponse.uf);
      setValue("cidade", viacepResponse.localidade);
      setValue(
        "endereco",
        viacepResponse.logradouro +
          " - " +
          viacepResponse.bairro +
          " - " +
          viacepResponse.localidade
      );
      setValue("bairro", viacepResponse.bairro);
      setValue("rua", viacepResponse.logradouro);
    },
    [setValue]
  );

  const handleGetCepData = useCallback(
    async (cep: string) => {
      const data = await getCepData(cep);
      handleSetFormData(data);
    },
    [handleSetFormData]
  );

  const cep = watch("cep");
  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    const isCepValid = createCepFormSchema.shape.cep.safeParse(cep).success;
    if (isCepValid) {
      handleGetCepData(cep);
    }
  }, [handleGetCepData, cep]);



  function upadateFornecedor(data: any) {
    FornecedoresService.updateById(Number(id), data)
      .then(() => {
        setIsEditable(false);
        setPageState("detalhes")
      })
      .catch((erro) => {});
  }
  function updateFornecedoresFechar(data: any) {
    FornecedoresService.updateById(Number(id), data)
      .then(() => {
        navigate(-1);
      })
      .catch((erro) => {});
  }

  const fetchData = async () => {
    try {
      const data: IFornecedor | Error = await FornecedoresService.getById(
        Number(id)
      );
      if (data instanceof Error) {
        return;
      }
      setValue(
        "razaoSocial",
        data.razaoSocial == null ? undefined : data.razaoSocial
      );
      setValue(
        "nomeFantasia",
        data.nomeFantasia == null ? undefined : data.nomeFantasia
      );
      setValue("cnpj", data.cnpj == null ? undefined : data.cnpj);
      setValue("rg", data.rg == null ? undefined : data.rg);
      setValue("cpf", data.cpf == null ? undefined : data.cpf);
      setValue("nome", data.nome == null ? undefined : data.nome);
      setTipo(data.contaTipo);
      setValue("email", data.email);
      setValue("telefone", data.telefone);
      setValue("cep", data.cep);
      setValue("pais", data.pais);
      setValue("estado", data.estado);
      setValue("cidade", data.cidade);
      setValue("bairro", data.bairro);
      setValue("rua", data.rua);
      setValue("numero", data.numero);
      setValue("complemento", data.complemento);
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
      titulo="Editar Fornecedor"
      barraDeFerramentas={
        <FerramentasDeDetalhes
          tipo="detalhes"
          pageState={pageState}
        
          setPaiState={setPageState}
          onClickCancelar={fetchData}
          onClickSalvar={handleSubmit(upadateFornecedor)}
          onClickSalvarEFechar={handleSubmit(updateFornecedoresFechar)}
        />
      }
    >
      <Box component={"form"} onSubmit={handleSubmit(upadateFornecedor)}>
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
                <Typography>Dados Básicos</Typography>
              </Grid>
            </Grid>
            <Grid container item direction="row" spacing={4}>
              <Grid item>
                <InputLabel id="tipo">Tipo</InputLabel>
                <Select
                  labelId="contaTipo"
                  id="contaTipo"
                  value={tipo}

                  {...register("contaTipo")}
                  onChange={handleChange}
                >
                  <MenuItem value={"Fisica"} disabled={!isEditable}>Fisico</MenuItem>
                  <MenuItem value={"Juridica"} disabled={!isEditable}>Juridico</MenuItem>
                </Select>

                {errors.contaTipo && (
                  <span>{errors.contaTipo.message?.toString()}</span>
                )}
              </Grid>
              {tipo === "Juridica" && (
                <>
                  <Grid item>
                  <Box>
                    <Typography>Razão Social</Typography>
                    <TextField
                      placeholder="Razão Social" disabled={!isEditable}
                      {...register("razaoSocial")}
                    />
                    </Box>
                    {errors.razaoSocial && (
                      <span>{errors.razaoSocial.message?.toString()}</span>
                    )}
                  </Grid>
                  <Grid item>
                  <Box>
                    <Typography>Nome Fantasia</Typography>
                    <TextField
                      placeholder="Nome Fantasia" disabled={!isEditable}
                      {...register("nomeFantasia")}
                    />
                    </Box>
                    {errors.nomeFantasia && (
                      <span>{errors.nomeFantasia.message?.toString()}</span>
                    )}
                  </Grid>
                  <Grid item>
                  <Box>
                    <Typography>CNPJ</Typography>
                    <TextField placeholder="CNPJ"  disabled={!isEditable} {...register("cnpj")} />
                    </Box>
                    {errors.cnpj && (
                      <span>{errors.cnpj.message?.toString()}</span>
                    )}
                  </Grid>
                </>
              )}
              {tipo === "Fisica" && (
                <>
                  <Grid item>
                  <Box>
                    <Typography>Nome Completo</Typography>
                    <TextField
                      placeholder="Nome Completo" disabled={!isEditable}
                      {...register("nome")}
                    />
                    </Box>
                    {errors.nome && (
                      <span>{errors.nome.message?.toString()}</span>
                    )}
                  </Grid>
                  <Grid item>
                  <Box>
                    <Typography>RG</Typography>
                    <TextField placeholder="RG" disabled={!isEditable} {...register("rg")} />
                    </Box>
                    {errors.rg && <span>{errors.rg.message?.toString()}</span>}
                  </Grid>
                 
                  <Grid item>
                  <Box>
                    <Typography>CPF</Typography>
                    <TextField placeholder="CPF" disabled={!isEditable} {...register("cpf")} />
                    </Box>
                    {errors.cpf && (
                      <span>{errors.cpf.message?.toString()}</span>
                    )}
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
        </Box>
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
                <Typography>Contatos</Typography>
              </Grid>
            </Grid>
            <Grid container item direction="row" spacing={4}>
            <Grid item>
                <Box>
                <Typography>Email</Typography>
                <TextField
                  placeholder="Email"
                  type="email" disabled={!isEditable}
                  {...register("email")}
                />
                </Box>
                {errors.email && (
                      <span>{errors.email.message?.toString()}</span>
                    )}
              </Grid>
              <Grid item>
                <Box>
                <Typography>Telefone</Typography>
                <TextField placeholder="Telefone" disabled={!isEditable} {...register("telefone")} />
                </Box>
                {errors.telefone && (
                      <span>{errors.telefone.message?.toString()}</span>
                    )}
              </Grid>
            </Grid>
          </Grid>
        </Box>
        <Box
          display={"flex"}
          margin={1}
          flexDirection={"column"}
          component={Paper}
          variant="outlined"
        >
          <Grid container direction="column" padding={2} spacing={2}>
            <Grid container item direction="row" spacing={2}>
              <Grid item>
                <Typography>Endereço</Typography>
              </Grid>
            </Grid>
            <Grid container item direction="row" spacing={3}>
              <Grid item>
                <Typography>CEP</Typography>
                <TextField placeholder="CEP" disabled={!isEditable} {...register("cep")} />
                {errors.cep && <span>{errors.cep.message?.toString()}</span>}
              </Grid>
              <Grid item xs={5}>
                <Typography>Endereço</Typography>
                <TextField
                  placeholder="Endereço"
                  fullWidth disabled={!isEditable}
                  {...register("endereco")}
                />
              </Grid>
              <Grid item>
                <Typography>Rua</Typography>
                <TextField placeholder="Rua" disabled={!isEditable} {...register("rua")} />
              </Grid>

              <Grid item>
                <Typography>Bairro</Typography>
                <TextField placeholder="Bairro" disabled={!isEditable} {...register("bairro")} />
              </Grid>
            </Grid>
            <Grid container item direction="row" spacing={2}>
              <Grid item xs={3}>
                <Typography>Cidade</Typography>
                <TextField
                  placeholder="Cidade"
                  fullWidth disabled={!isEditable}
                  {...register("cidade")}
                />
              </Grid>
              <Grid item xs={3}>
                <Typography>Estado</Typography>
                <TextField
                  placeholder="Estado"
                  fullWidth disabled={!isEditable}
                  {...register("estado")}
                />
              </Grid>
              <Grid item xs={3}>
                <Typography>Numero</Typography>
                <TextField
                  placeholder="Numero"
                  fullWidth disabled={!isEditable}
                  {...register("numero")}
                />
              </Grid>
              <Grid item xs={3}>
                <Typography>Pais</Typography>
                <TextField placeholder="Pais" fullWidth disabled={!isEditable} {...register("pais")} />
              </Grid>
            </Grid>
            <Grid container item direction="row" spacing={2}>
              <Grid item xs={9}>
                <Typography>Complemento</Typography>
                <TextField
                  placeholder="Complemento"
                  fullWidth disabled={!isEditable}
                  {...register("complemento")}
                />
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </PaginaBase>
  );
};
