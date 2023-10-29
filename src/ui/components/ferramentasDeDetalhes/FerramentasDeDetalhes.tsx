import {
  Box,
  useTheme,
  Paper,
  Icon,
  Button,
  Divider,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export type TTipo = "novo" | "editar" | "detalhes";

interface IFerramentasDeDetalhes {
  tipo: TTipo;
  textoBotaoNovo?: string;

  mostrarBotaoSalvar?: boolean;
  mostrarBotaoSalvarEFechar?: boolean;
  mostrarBotaoApagar?: boolean;
  mostrarBotaoNovo?: boolean;
  mostrarBotaoVoltar?: boolean;
  mostrarBotaoEditar?: boolean;
  mostrarBotaoCancelar?: boolean;

  onClickSalvar?: () => {};
  onClickSalvarEFechar?: () => {};
  onClickApagar?: () => {};
  onClickNovo?: () => {};
  onClickVoltar?: () => {};
  onClickEditar?: () => {};
  onClickCancelar?: () => {};

  skeletonSalvar?: boolean;
  skeletonSalvarEFechar?: boolean;
  skeletonApagar?: boolean;
  skeletonNovo?: boolean;
  skeletonVoltar?: boolean;

  setPaiState?: (tipo: TTipo) => void;
}

export const FerramentasDeDetalhes: React.FC<IFerramentasDeDetalhes> = (
  props
) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const voltar = () => {
    navigate(-1);
  };

  const {
    onClickApagar,
    onClickCancelar,
    onClickEditar,
    onClickNovo,
    onClickSalvar,
    onClickSalvarEFechar,
    onClickVoltar,
    textoBotaoNovo,
  } = props;

  const [tipo, setTipo] = useState<TTipo>("detalhes");
  const [mostrarBotaoSalvar, setMostrarBotaoSalvar] = useState<boolean>(false);
  const [mostrarBotaoSalvarEFechar, setMostrarBotaoSalvarEFechar] =
    useState<boolean>(false);
  const [mostrarBotaoApagar, setMostrarBotaoApagar] = useState<boolean>(false);
  const [mostrarBotaoNovo, setMostrarBotaoNovo] = useState<boolean>(false);
  const [mostrarBotaoVoltar, setMostrarBotaoVoltar] = useState<boolean>(true);
  const [mostrarBotaoEditar, setMostrarBotaoEditar] = useState<boolean>(true);
  const [mostrarBotaoCancelar, setMostrarBotaoCancelar] =
    useState<boolean>(false);

  useEffect(() => {
    setMostrarBotaoSalvar(
      tipo === "novo"
        ? true
        : tipo === "editar"
        ? true
        : tipo === "detalhes"
        ? false
        : false
    );
    setMostrarBotaoSalvarEFechar(
      tipo === "novo"
        ? true
        : tipo === "editar"
        ? true
        : tipo === "detalhes"
        ? false
        : false
    );
    setMostrarBotaoApagar(
      tipo === "novo"
        ? false
        : tipo === "editar"
        ? false
        : tipo === "detalhes"
        ? true
        : false
    );
    setMostrarBotaoNovo(
      tipo === "novo"
        ? false
        : tipo === "editar"
        ? false
        : tipo === "detalhes"
        ? false
        : false
    );
    setMostrarBotaoVoltar(
      tipo === "novo"
        ? true
        : tipo === "editar"
        ? true
        : tipo === "detalhes"
        ? true
        : false
    );
    setMostrarBotaoEditar(
      tipo === "novo"
        ? false
        : tipo === "editar"
        ? false
        : tipo === "detalhes"
        ? true
        : false
    );
    setMostrarBotaoCancelar(
      tipo === "novo"
        ? true
        : tipo === "editar"
        ? true
        : tipo === "detalhes"
        ? false
        : false
    );
    setPaiState();
  }, [tipo]);

  useEffect(() => {
    setTipo(props.tipo);
  }, []);

  const setPaiState = () => {
    if (props.setPaiState) props.setPaiState(tipo);
  };

  return (
    <Box
      component={Paper}
      height={theme.spacing(8)}
      padding={1}
      paddingX={2}
      display={"flex"}
      gap={1}
      alignItems={"center"}
    >
      {mostrarBotaoSalvar && (
        <Button
          color="primary"
          variant="contained"
          disableElevation
          startIcon={<Icon>save</Icon>}
          onClick={onClickSalvar}
        >
          <Typography
            variant="button"
            whiteSpace={"nowrap"}
            textOverflow={"ellipsis"}
            overflow={"hidden"}
          >
            Salvar
          </Typography>
        </Button>
      )}

      {mostrarBotaoSalvarEFechar && (
        <Button
          color="primary"
          variant="outlined"
          disableElevation
          startIcon={<Icon>save</Icon>}
          onClick={onClickSalvarEFechar}
        >
          <Typography
            variant="button"
            whiteSpace={"nowrap"}
            textOverflow={"ellipsis"}
            overflow={"hidden"}
          >
            Salvar e fechar
          </Typography>
        </Button>
      )}

      {mostrarBotaoApagar && (
        <Button
          color="primary"
          variant="outlined"
          disableElevation
          startIcon={<Icon>delete</Icon>}
          onClick={onClickApagar}
        >
          <Typography
            variant="button"
            whiteSpace={"nowrap"}
            textOverflow={"ellipsis"}
            overflow={"hidden"}
          >
            Apagar
          </Typography>
        </Button>
      )}

      {mostrarBotaoNovo && (
        <Button
          color="primary"
          variant="outlined"
          disableElevation
          startIcon={<Icon>add</Icon>}
          onClick={onClickNovo}
        >
          <Typography
            variant="button"
            whiteSpace={"nowrap"}
            textOverflow={"ellipsis"}
            overflow={"hidden"}
          >
            {textoBotaoNovo}
          </Typography>
        </Button>
      )}
      {mostrarBotaoEditar && (
        <Button
          color="primary"
          variant="outlined"
          disableElevation
          startIcon={<Icon>edit</Icon>}
          onClick={() => {
            if (onClickEditar) {
              onClickEditar();
            }
            setTipo("editar");
          }}
        >
          <Typography
            variant="button"
            whiteSpace={"nowrap"}
            textOverflow={"ellipsis"}
            overflow={"hidden"}
          >
            Editar
          </Typography>
        </Button>
      )}
      {mostrarBotaoCancelar && (
        <Button
          color="primary"
          variant="outlined"
          disableElevation
          startIcon={<Icon>block</Icon>}
          onClick={() => {
            if (onClickCancelar) {
              onClickCancelar();
            }
            setTipo("detalhes");
          }}
        >
          <Typography
            variant="button"
            whiteSpace={"nowrap"}
            textOverflow={"ellipsis"}
            overflow={"hidden"}
          >
            Cancelar
          </Typography>
        </Button>
      )}

      {mostrarBotaoVoltar && (
        <>
          <Divider variant="middle" orientation="vertical" />
          <Button
            color="primary"
            variant="outlined"
            disableElevation
            startIcon={<Icon>arrow_back</Icon>}
            onClick={onClickVoltar || voltar}
          >
            <Typography
              variant="button"
              whiteSpace={"nowrap"}
              textOverflow={"ellipsis"}
              overflow={"hidden"}
            >
              Voltar
            </Typography>
          </Button>
        </>
      )}
    </Box>
  );
};
