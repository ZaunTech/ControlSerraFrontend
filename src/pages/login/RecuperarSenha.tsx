import { useState } from "react";

import Typography from "@mui/material/Typography";

import {
  Icon,
  Box,
  Link,
  IconButton,
  Button,
  TextField,
  OutlinedInput,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

const createUserFormSchema = z
  .object({
    nome: z.string().min(1, "Faltou o nome"),
    email: z.string().min(1, "Faltou o nome").email("isso não é email"),
    confemail: z.string().min(1, "Faltou o nome").email("Isso não é email"),
  })
  .refine((fileds) => fileds.email === fileds.confemail, {
    path: ["confemail"],
    message: "Os emails precisam ser iguais",
  });

export function RecuperarSenha() {
  function createUser(data: any) {
    console.log(data);
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createUserFormSchema),
  });
  const [output, setOutput] = useState("");
  return (
    <Box id="Main" flexDirection={"row"} display={"flex"}>
      <Box
        width={"40vw"}
        height={"100vh"}
        display={"flex"}
        flexDirection={"column"}
        padding={"30px"}
        bgcolor={"text.primary"}
        color={"secondary.contrastText"}
        justifyContent={"space-between"}
        alignContent={"space-between"}
      >
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"space-between"}
          height={"25%"}
        >
          <Typography variant="body1">Control Serra</Typography>

          <Box
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"space-evenly"}
            alignItems={"center"}
            width={"60%"}
          >
            <Icon>album</Icon>

            <Box display={"flex"} flexDirection={"column"}>
              <Typography variant="h5">Recuperar senha</Typography>
              <Typography variant="h6">Preencha seu email</Typography>
            </Box>
          </Box>
        </Box>

        <Box
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"space-between"}
          justifyItems={"space-between"}
          alignItems={"space-between"}
          width={"100%"}
        >
          <Typography variant="body1">Versão 1</Typography>
          <Typography variant="body1">NossoEmail@Fatec.sp.gov.br</Typography>
        </Box>
      </Box>
      <Box
        width={"60vw"}
        height={"100vh"}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        alignContent={"center"}
      >
        <Box
          display={"flex"}
          component={"form"}
          onSubmit={handleSubmit(createUser)}
          flexDirection={"column"}
          justifyContent={"space-between"}
          height={"50%"}
        >
          <Box>
            <Typography variant="h4">Dados de Recuperação</Typography>
            <Typography variant="h6">Preencha seu Dados</Typography>
          </Box>

          <OutlinedInput
            size="small"
            placeholder="Nome completo"
            {...register("nome")}
          />
          {errors.nome && <span>{errors.nome.message?.toString()}</span>}
          <OutlinedInput
            type="email"
            size="small"
            placeholder="Email"
            {...register("email")}
          />
          {errors.email && <span>{errors.email.message?.toString()}</span>}
          <OutlinedInput
            type="email"
            size="small"
            placeholder="Confirmar Email"
            {...register("confemail")}
          />
          {errors.confemail && (
            <span>{errors.confemail.message?.toString()}</span>
          )}
          <Button variant="contained" type="submit">
            {" "}
            Recuperar Senha{" "}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
