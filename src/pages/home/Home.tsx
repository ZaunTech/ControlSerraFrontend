import {
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Typography,
} from "@mui/material";
import { PaginaBase } from "../../ui/layouts";
import {
  CategoriasService,
  ClientesService,
  FornecedoresService,
  InsumosService,
} from "../../data/services/api";
import { useEffect, useState } from "react";
import { ProdutosService } from "../../data/services/api/modules/produtos";
import { PedidosService } from "../../data/services/api/modules/pedidos";
import { OrcamentosService } from "../../data/services/api/modules/orcamentos";

export const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [totalCountClientes, setTotalCountClientes] = useState<number | null>(
    null
  );
  const [totalCountOrcamentos, setTotalCountOrcamentos] = useState<
    number | null
  >(null);
  const [totalCountPedidos, setTotalCountPedidos] = useState<number | null>(
    null
  );
  const [totalCountInsumos, setTotalCountInsumos] = useState<number | null>(
    null
  );
  const [totalCountProdutos, setTotalCountProdutos] = useState<number | null>(
    null
  );
  const [totalCountCategorias, setTotalCountCategorias] = useState<
    number | null
  >(null);
  const [totalCountFornecedores, setTotalCountFornecedores] = useState<
    number | null
  >(null);

  const [countsFound, setCountsFound] = useState<number>(0);
  const [counted, setCounted] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    ClientesService.getCount().then((result) => {
      if (result instanceof Error) {
        //alert(result.message);
        return;
      }
      setCountsFound(countsFound + 1);
      setTotalCountClientes(result);
    });
    OrcamentosService.getCount().then((result) => {
      if (result instanceof Error) {
        //alert(result.message);
        return;
      }
      setCountsFound(countsFound + 1);
      setTotalCountOrcamentos(result);
    });
    PedidosService.getCount().then((result) => {
      if (result instanceof Error) {
        //alert(result.message);
        return;
      }
      setCountsFound(countsFound + 1);
      setTotalCountPedidos(result);
    });
    InsumosService.getCount().then((result) => {
      if (result instanceof Error) {
        //alert(result.message);
        return;
      }
      setCountsFound(countsFound + 1);
      setTotalCountInsumos(result);
    });
    ProdutosService.getCount().then((result) => {
      if (result instanceof Error) {
        //alert(result.message);
        return;
      }
      setCountsFound(countsFound + 1);
      setTotalCountProdutos(result);
    });
    CategoriasService.getCount().then((result) => {
      if (result instanceof Error) {
        //alert(result.message);
        return;
      }
      setCountsFound(countsFound + 1);
      setTotalCountCategorias(result);
    });
    FornecedoresService.getCount().then((result) => {
      if (result instanceof Error) {
        //alert(result.message);
        return;
      }
      setCountsFound(countsFound + 1);
      setTotalCountFornecedores(result);
    });
    setCounted(true);
    setIsLoading(false);
  }, []);

  return (
    <PaginaBase titulo="Home">
      <Box width={"100%"} display={"flex"}>
        <Grid container margin={2}>
          <Grid item container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
              {isLoading && (
                <>
                  <Card>
                    <CardContent>
                      <Box
                        display={"flex"}
                        padding={6}
                        justifyContent={"center"}
                        alignItems={"center"}
                      >
                        <LinearProgress variant="indeterminate" />
                      </Box>
                    </CardContent>
                  </Card>
                </>
              )}
              {!isLoading && countsFound === 0 && counted && (
                <>
                  <Card>
                    <CardContent>
                      <Typography variant="h5" align="center">
                        Não foi possivel carregar as estatisticas
                      </Typography>
                      <Box
                        display={"flex"}
                        padding={6}
                        justifyContent={"center"}
                        alignItems={"center"}
                      >
                        <Typography variant="h3">...</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </>
              )}
              {totalCountClientes != null && !isLoading && (
                <>
                  <Card>
                    <CardContent>
                      <Typography variant="h5" align="center">
                        Total de Clientes
                      </Typography>
                      <Box
                        display={"flex"}
                        padding={6}
                        justifyContent={"center"}
                        alignItems={"center"}
                      >
                        <Typography variant="h1">
                          {totalCountClientes}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </>
              )}
              {totalCountOrcamentos != null && !isLoading && (
                <>
                  <Card>
                    <CardContent>
                      <Typography variant="h5" align="center">
                        Total de Orçamentos
                      </Typography>
                      <Box
                        display={"flex"}
                        padding={6}
                        justifyContent={"center"}
                        alignItems={"center"}
                      >
                        <Typography variant="h1">
                          {totalCountOrcamentos}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </>
              )}
              {totalCountPedidos != null && !isLoading && (
                <>
                  <Card>
                    <CardContent>
                      <Typography variant="h5" align="center">
                        Total de Pedidos
                      </Typography>
                      <Box
                        display={"flex"}
                        padding={6}
                        justifyContent={"center"}
                        alignItems={"center"}
                      >
                        <Typography variant="h1">
                          {totalCountPedidos}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </>
              )}
              {totalCountInsumos != null && !isLoading && (
                <>
                  <Card>
                    <CardContent>
                      <Typography variant="h5" align="center">
                        Total de Insumos
                      </Typography>
                      <Box
                        display={"flex"}
                        padding={6}
                        justifyContent={"center"}
                        alignItems={"center"}
                      >
                        <Typography variant="h1">
                          {totalCountInsumos}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </>
              )}
              {totalCountProdutos != null && !isLoading && (
                <>
                  <Card>
                    <CardContent>
                      <Typography variant="h5" align="center">
                        Total de Produtos
                      </Typography>
                      <Box
                        display={"flex"}
                        padding={6}
                        justifyContent={"center"}
                        alignItems={"center"}
                      >
                        <Typography variant="h1">
                          {totalCountProdutos}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </>
              )}
              {totalCountCategorias != null && !isLoading && (
                <>
                  <Card>
                    <CardContent>
                      <Typography variant="h5" align="center">
                        Total de Categorias
                      </Typography>
                      <Box
                        display={"flex"}
                        padding={6}
                        justifyContent={"center"}
                        alignItems={"center"}
                      >
                        <Typography variant="h1">
                          {totalCountCategorias}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </>
              )}
              {totalCountFornecedores != null && !isLoading && (
                <>
                  <Card>
                    <CardContent>
                      <Typography variant="h5" align="center">
                        Total de Fornecedores
                      </Typography>
                      <Box
                        display={"flex"}
                        padding={6}
                        justifyContent={"center"}
                        alignItems={"center"}
                      >
                        <Typography variant="h1">
                          {totalCountFornecedores}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </PaginaBase>
  );
};
