import {
  Box,
  Button,
  Icon,
  Paper,
  TextField,
  useTheme,
  InputAdornment,
  Typography,
} from "@mui/material";
import { Environment } from "../../../data/environment";
import { useNavigate } from "react-router-dom";

interface IFerramentasDeListagem {
  textoDaBusca?: string;
  mostrarInputBusca?: boolean;
  onChangeBuscaTexto?: (novoTexto: string) => void;
  textoBotaoNovo?: string;
  mostrarBotaoNovo?: boolean;
  onClickBotaoNovo?: () => void;
  mostrarBotaoVoltar?: boolean;
  onClickBotaoVoltar?: () => void;
  componentePersonalizado?: React.ReactNode;
}

export const FerramentasDeListagem: React.FC<IFerramentasDeListagem> = ({
  textoDaBusca = "Pesquisar...",
  mostrarInputBusca = false,
  onChangeBuscaTexto,
  textoBotaoNovo = "Novo",
  mostrarBotaoNovo = true,
  onClickBotaoNovo,
  mostrarBotaoVoltar = false,
  onClickBotaoVoltar,
  componentePersonalizado,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const voltar = () => {
    navigate(-1);
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
      justifyContent={"space-between"}
    >
      {mostrarInputBusca && (
        <TextField
          size={"small"}
          placeholder={Environment.INPUT_DE_BUSCA}
          value={textoDaBusca}
          onChange={(e) => {
            onChangeBuscaTexto?.(e.target.value);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Icon>search</Icon>
              </InputAdornment>
            ),
          }}
        />
      )}
      {componentePersonalizado}
      {mostrarBotaoNovo && (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"end"}
          flex={1}
        >
          <Button
            color="primary"
            variant="contained"
            disableElevation
            endIcon={<Icon>add</Icon>}
            onClick={onClickBotaoNovo}
          >
            {textoBotaoNovo}
          </Button>
        </Box>
      )}
      {mostrarBotaoVoltar && (
        <>
          <Button
            color="primary"
            variant="outlined"
            disableElevation
            startIcon={<Icon>arrow_back</Icon>}
            onClick={onClickBotaoVoltar || voltar}
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
