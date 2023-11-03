import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import {
  Icon,
  Box,
  Link,
  IconButton,
  Button,
  OutlinedInput,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import { useAuthContext } from "../../data/contexts";
import { useNavigate } from "react-router-dom";

const createUserFormSchema = z.object({
  email: z.string().min(1, "Faltou o nome").email("isso não é email"),
  senha: z.string().min(1, "Preencha a senha"),
});

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createUserFormSchema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthContext();

  const navigate = useNavigate();

  const handleFormLoginSubmit = (data: any) => {
    const { email, password } = data;
    setIsLoading(true);
    login(email, password)
      .then((result) => {
        setIsLoading(false);
        if (result instanceof Error) {
          return result.message;
        }
        navigate("/");
        return;
      })
      .catch((err) => {
        setIsLoading(false);
        return err;
      });
  };

  const { isAuthenticated } = useAuthContext();

  useEffect(() => {
    console.log(isAuthenticated);
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  return (
    <Box id="Main" flexDirection={"row"} display={"flex"}>
      <Box
        width={"40vw"}
        height={"100vh"}
        display={"flex"}
        flexDirection={"column"}
        bgcolor={"text.primary"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Box
          id="Conteudo"
          width={"70%"}
          height={"100%"}
          display={"flex"}
          alignContent={"center"}
          flexWrap={"wrap"}
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"space-evenly"}
          color={"secondary.contrastText"}
        >
          <Box id="Imagens" flexDirection={"row"} display={"flex"}>
            <Icon>handyman</Icon>
            <Icon>handyman</Icon>
          </Box>

          <Typography variant="h4">Control Serra</Typography>

          <Typography variant="body1">
            Uma maneira eficaz de gerenciar sua serralheria com facilidade e
            precisão.
          </Typography>

          <Typography variant="body1">
            Potencialize seu controle de orçamentos, estoque e produção para
            resultados excepcionais.
          </Typography>

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
      </Box>
      <Box
        component={"form"}
        onSubmit={handleSubmit(handleFormLoginSubmit)}
        width={"60vw"}
        height={"100vh"}
        display={"flex"}
        flexDirection={"column"}
        justifyItems={"center"}
        alignItems={"center"}
        alignContent={"center"}
        justifyContent={"center"}
      >
        <Box
          id="ConteudoLogin"
          width={"40%"}
          height={"50%"}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"space-around"}
          alignContent={"center"}
        >
          <Box>
            <Typography variant="h4">Olá, seja bem-vindo</Typography>
            <Typography variant="h5">Faça login para continuar</Typography>
          </Box>
          <OutlinedInput
            disabled={isLoading}
            type="email"
            size="small"
            placeholder="Email"
            required
            {...register("email")}
          />
          {errors.email && <span>{errors.email.message?.toString()}</span>}

          <OutlinedInput
            disabled={isLoading}
            type="password"
            size="small"
            placeholder="Senha"
            {...register("senha")}
            endAdornment={
              <IconButton>
                <Icon>visibility</Icon>
              </IconButton>
            }
          />
          {errors.senha && <span>{errors.senha.message?.toString()}</span>}
          <Box
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <FormControlLabel
              control={<Checkbox defaultChecked size="small" />}
              label="Lembrar Senha?"
            />

            <Link
              href="https://www.exemplo.com"
              target="_blank"
              rel="noopener"
              variant="body2"
            >
              {"Esqueci Minha Senha"}
            </Link>
          </Box>

          <Button
            disabled={isLoading}
            variant="contained"
            type="submit"
            endIcon={
              isLoading ? (
                <CircularProgress
                  size={20}
                  variant="indeterminate"
                  color="inherit"
                />
              ) : undefined
            }
          >
            Login
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
