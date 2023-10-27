import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import { useMemo } from "react";
import { PaginaBase } from "../../ui/layouts";
import {
  FerramentasDaListagem,
  FerramentasDeDetalhes,
} from "../../ui/components";
import {
  Autocomplete,
  Box,
  FormControl,
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
import { useNavigate, useParams, useSubmit } from "react-router-dom";
import getCepData from "../../data/services/api/axios-config/actions/cep";
import { ReplySharp } from "@mui/icons-material";
import { ClientesService, ICliente } from "../../data/services/api";

const createUserFormSchema = z.object({
  razaoSocial: z.string(),
  nomeFantasia: z.string(),
  nome: z.string(),
  rg: z.string(),
  cpf: z.string(),
  cnpj: z.string(),
  contaTipo: z.string(),
  email: z.string().min(1, "Faltou o nome").email("isso não é email"),
  telefone: z.string(),
  cep: z.string().min(8),
  pais: z.string(),
  estado: z.string(),
  cidade: z.string(),
  bairro: z.string(),
  rua: z.string(),
  numero: z.string(),
  complemento: z.string(),
});

const createCepFormSchema = z.object({
  cep: z.string().min(8),
  pais: z.string(),
  estado: z.string(),
  cidade: z.string(),
  bairro: z.string(),
  rua: z.string(),
  numero: z.string(),
  complemento: z.string(),
});
type createCepFormData = z.infer<typeof createCepFormSchema>;

export const Cliente = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createUserFormSchema),
  });
  const [output, setOutput] = useState("");
  enum contaTipo {
    Fisico,
    Juridico,
  }

  const handleChange = (event: SelectChangeEvent) => {
    setTipo(event.target.value as string);
    setValue("nome", "");
    setValue("nomeFantasia", "");
    setValue("rg", "");
    setValue("cpf", "");
    setValue("cnpj", "");
    setValue("razaoSocial", "");
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
  const handleFormSubmit = async (data: createCepFormData) => {};

  const [cliente, setCliente] = useState<ICliente | null>(null);

  const { id } = useParams();
  const [tipo, setTipo] = React.useState("Juridica");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: ICliente | Error = await ClientesService.getById(
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
        setTipo(data.contaTipo.toString());
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
        // Do something with the 'data' here
      } catch (error) {
        // Handle errors here
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleGetCepData = useCallback(
    async (cep: string) => {
      const data = await getCepData(cep);
      console.log(data);
      handleSetFormData(data);
    },
    [handleSetFormData]
  );

  const cep = watch("cep");
  const navigate = useNavigate();
  useEffect(() => {
    const isCepValid = createCepFormSchema.shape.cep.safeParse(cep).success;
    if (isCepValid) {
      console.log("Cep valido");

      handleGetCepData(cep);
    }
  }, [handleGetCepData, cep]);

  function createUser(data: any) {
    ClientesService.updateById(Number(id), data)
      .then(() => {
        navigate(-1);
      })
      .catch((erro) => {
        console.log(erro.data);
      });
  }

  return (
    <PaginaBase
      titulo="Editar Cliente"
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
                  value={tipo.toString()}
                  {...register("contaTipo")}
                  onChange={handleChange}
                >
                  <MenuItem value={"Fisica"}>Fisico</MenuItem>
                  <MenuItem value={"Juridica"}>Juridico</MenuItem>
                </Select>

                {errors.contaTipo && (
                  <span>{errors.contaTipo.message?.toString()}</span>
                )}
              </Grid>
              {tipo === "Juridica" && (
                <>
                  <Grid item>
                    <Typography>Razão Social</Typography>
                    <TextField
                      placeholder="Razão Social"
                      {...register("razaoSocial")}
                    />
                  </Grid>
                  <Grid item>
                    <Typography>Nome Fantasia</Typography>
                    <TextField
                      placeholder="Nome Fantasia"
                      {...register("nomeFantasia")}
                    />
                  </Grid>
                  <Grid item>
                    <Typography>CNPJ</Typography>
                    <TextField placeholder="CNPJ" {...register("cnpj")} />
                  </Grid>
                </>
              )}
              {tipo === "Fisica" && (
                <>
                  <Grid item>
                    <Typography>Nome Completo</Typography>
                    <TextField
                      placeholder="Nome Completo"
                      {...register("nome")}
                    />
                  </Grid>
                  <Grid item>
                    <Typography>RG</Typography>
                    <TextField placeholder="RG" {...register("rg")} />
                  </Grid>
                  <Grid item>
                    <Typography>CPF</Typography>
                    <TextField placeholder="CPF" {...register("cpf")} />
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
              <Grid item xs={4}>
                <Typography>Email</Typography>
                <TextField
                  fullWidth
                  placeholder="Email"
                  type="email"
                  {...register("email")}
                />
              </Grid>
              <Grid item>
                <Typography>Telefone</Typography>
                <TextField placeholder="Telefone" {...register("telefone")} />
              </Grid>
              <Grid item>
                <Typography>Celular</Typography>
                <TextField placeholder="Celular" {...register("celular")} />
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
                <TextField placeholder="CEP" {...register("cep")} />
                {errors.cep && <span>{errors.cep.message?.toString()}</span>}
              </Grid>

              <Grid item>
                <Typography>Rua</Typography>
                <TextField placeholder="Rua" {...register("rua")} />
              </Grid>

              <Grid item>
                <Typography>Bairro</Typography>
                <TextField placeholder="Bairro" {...register("bairro")} />
              </Grid>
            </Grid>
            <Grid container item direction="row" spacing={2}>
              <Grid item xs={3}>
                <Typography>Cidade</Typography>
                <TextField
                  placeholder="Cidade"
                  fullWidth
                  {...register("cidade")}
                />
              </Grid>
              <Grid item xs={3}>
                <Typography>Estado</Typography>
                <TextField
                  placeholder="Estado"
                  fullWidth
                  {...register("estado")}
                />
              </Grid>
              <Grid item xs={3}>
                <Typography>Numero</Typography>
                <TextField
                  placeholder="Numero"
                  fullWidth
                  {...register("numero")}
                />
              </Grid>
              <Grid item xs={3}>
                <Typography>Pais</Typography>
                <TextField placeholder="Pais" fullWidth {...register("pais")} />
              </Grid>
            </Grid>
            <Grid container item direction="row" spacing={2}>
              <Grid item xs={9}>
                <Typography>Complemento</Typography>
                <TextField
                  placeholder="Complemento"
                  fullWidth
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
export default Cliente;
