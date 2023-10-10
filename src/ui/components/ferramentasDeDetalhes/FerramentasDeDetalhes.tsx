import {
  Box,
  useTheme,
  Paper,
  Icon,
  Button,
  Divider,
  Skeleton,
  Typography,
} from "@mui/material";

interface IFerramentasDeDetalhes {
  textoBotaoNovo?: string;

  mostrarBotaoSalvar?: boolean;
  mostrarBotaoSalvarEFechar?: boolean;
  mostrarBotaoApagar?: boolean;
  mostrarBotaoNovo?: boolean;
  mostrarBotaoVoltar?: boolean;

  onClickSalvar?: () => {};
  onClickSalvarEFechar?: () => {};
  onClickApagar?: () => {};
  onClickNovo?: () => {};
  onClickVoltar?: () => {};

  skeletonSalvar?: boolean;
  skeletonSalvarEFechar?: boolean;
  skeletonApagar?: boolean;
  skeletonNovo?: boolean;
  skeletonVoltar?: boolean;
}

export const FerramentasDeDetalhes: React.FC<IFerramentasDeDetalhes> = ({
  textoBotaoNovo = "Novo",

  mostrarBotaoSalvar = true,
  mostrarBotaoSalvarEFechar = false,
  mostrarBotaoApagar = true,
  mostrarBotaoNovo = true,
  mostrarBotaoVoltar = true,

  onClickSalvar,
  onClickSalvarEFechar,
  onClickApagar,
  onClickNovo,
  onClickVoltar,

  skeletonSalvar,
  skeletonSalvarEFechar,
  skeletonApagar,
  skeletonNovo,
  skeletonVoltar,
}) => {
  const theme = useTheme();
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
      {skeletonSalvar && <Skeleton width={110} height={60} />}
      {mostrarBotaoSalvar && !skeletonSalvar && (
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

      {skeletonSalvarEFechar && <Skeleton width={180} height={60} />}
      {mostrarBotaoSalvarEFechar && !skeletonSalvarEFechar && (
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

      {skeletonApagar && <Skeleton width={110} height={60} />}
      {mostrarBotaoApagar && !skeletonApagar && (
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

      {skeletonNovo && <Skeleton width={110} height={60} />}
      {mostrarBotaoNovo && skeletonNovo && (
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
      <Divider variant="middle" orientation="vertical" />

      {skeletonVoltar && <Skeleton width={110} height={60} />}
      {mostrarBotaoVoltar && !skeletonVoltar && (
        <Button
          color="primary"
          variant="outlined"
          disableElevation
          startIcon={<Icon>arrow_back</Icon>}
          onClick={onClickVoltar}
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
      )}
    </Box>
  );
};
