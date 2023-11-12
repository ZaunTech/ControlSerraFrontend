import React, { useCallback, useEffect, useState } from "react";
import { PaginaBase } from "../../ui/layouts";
import { FerramentasDeDetalhes, TTipo } from "../../ui/components";
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
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import getCepData from "../../data/services/api/axios-config/actions/cep";
import { ClientesService } from "../../data/services/api";
import { useNavigate } from "react-router-dom";

const createUserFormSchema = z
  .object({
    razaoSocial: z.string().optional(),
    nomeFantasia: z.string().optional(),
    cnpj: z.string().optional(),
    rg: z.string().optional(),
    cpf: z.string().optional(),
    nome: z.string().optional(),
    contaTipo: z.string(),
    email: z.string().min(1, "Digite seu Email").email("isso não é email"),
    telefone: z.string().min(1,"Digite seu Telefone"),
  
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
  numero: z.string(),
  complemento: z.string(),
});

export const CriarCliente = () => {
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

  useEffect(() => {
    const isCepValid = createCepFormSchema.shape.cep.safeParse(cep).success;
    if (isCepValid) {
      handleGetCepData(cep);
    }
  }, [handleGetCepData, cep]);

  const navigate = useNavigate();
  function createUser(data: any) {
    ClientesService.create(data)
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
      titulo="Novo Cliente"
      barraDeFerramentas={
        <FerramentasDeDetalhes
         
          tipo="novo"
          
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
                  <MenuItem value={"Juridica"} disabled={!isEditable} >Juridico</MenuItem>
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
                  </Grid>
                  {errors.rg && <span>{errors.rg.message?.toString()}</span>}
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
                  fullWidth
                  disabled={!isEditable}
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
            <Grid container item direction="row"  spacing={2}>
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
