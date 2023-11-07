import { useMemo, useEffect } from "react";
import { PaginaBase } from "../../ui/layouts";
import { FerramentasDaListagem } from "../../ui/components";
import {
  useNavigate,
  useSearchParams,
  useLocation,
  useParams,
} from "react-router-dom";
import { InsumosService, ProdutosBaseService } from "../../data/services/api";
import { useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TableFooter,
  LinearProgress,
  Pagination,
  IconButton,
  Icon,
} from "@mui/material";
import { Environment } from "../../data/environment";
import {
  IInsumosProdutoBase,
  InsumosProdutoBaseService,
} from "../../data/services/api/modules/insumosProdutoBase";

export const ItemListaInsumoProdutoBase = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [rows, setRows] = useState<IInsumosProdutoBase[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const busca = useMemo(() => {
    return searchParams.get("busca") || "";
  }, [searchParams]);

  const pagina = useMemo(() => {
    return Number(searchParams.get("pagina") || "1");
  }, [searchParams]);

  const [produtoName, setProdutoName] = useState<string>("");

  useEffect(() => {
    if (id === null || id === undefined) {
      return;
    }
    ProdutosBaseService.getById(Number(id)).then((result) => {
      if (result instanceof Error) {
        alert(result.message);
        return;
      }
      setProdutoName(result.titulo);
    });
  }, []);

  const setDados = async () => {
    try {
      setIsLoading(true);

      const result = await InsumosProdutoBaseService.getAll({ page: pagina, filter: busca });

      if (result instanceof Error) {
        alert(result.message);
        return;
      }

      const insumosData = await Promise.all(
        result.data.map(async (insumoProdutoBase: IInsumosProdutoBase) => {
          try {
            const result2 = await InsumosService.getById(
              insumoProdutoBase.idInsumo
            );

            if (result2 instanceof Error) {
              alert(result2.message);
              return null;
            }

            insumoProdutoBase.insumo = result2;
            return insumoProdutoBase;
          } catch (error) {
            return null;
          }
        })
      );
      setRows(insumosData);
      setTotalCount(result.totalCount);
    } catch (error) {
      alert("Error fetching data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setDados();
  }, [busca, pagina]);

  const handleDelete = (id: number) => {
    if (confirm("Você realmente quer apagar?")) {
      InsumosProdutoBaseService.deleteById(id).then((result) => {
        if (result instanceof Error) {
          alert(result.message);
          return;
        }
        setRows((oldRows) => [...oldRows.filter((oldRow) => oldRow.id !== id)]);
        alert("Registro apagado com sucesso");
      });
    }
  };

  return (
    <PaginaBase
      titulo={`Lista de insumos do produto ${produtoName}`}
      barraDeFerramentas={
        <FerramentasDaListagem
          mostrarInputBusca
          textoDaBusca={busca}
          onChangeBuscaTexto={(texto) =>
            setSearchParams({ busca: texto, pagina: "1" }, { replace: true })
          }
          onClickBotaoNovo={() => navigate(`${location.pathname}/novo`)}
          mostrarBotaoVoltar
        />
      }
    >
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ m: 1, width: "auto" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bold" }}>Ações</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Titulo</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Quantidade</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Dimensões</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Typography>
                    <IconButton
                      onClick={() => navigate(`${location.pathname}/${row.id}`)}
                    >
                      <Icon>edit</Icon>
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        handleDelete(row.id);
                      }}
                    >
                      <Icon>delete</Icon>
                    </IconButton>
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{row.insumo?.titulo}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{row.quantidade}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{row.unidade}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {totalCount === 0 && !isLoading && (
            <caption>{Environment.LISTAGEM_VAZIA}</caption>
          )}
          <TableFooter>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5}>
                  <LinearProgress variant="indeterminate" />
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              totalCount > 0 &&
              totalCount > Environment.LIMITE_DE_LINHAS && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Pagination
                      page={pagina}
                      count={Math.ceil(
                        totalCount / Environment.LIMITE_DE_LINHAS
                      )}
                      onChange={(_, newPage) => {
                        setSearchParams(
                          { busca, pagina: newPage.toString() },
                          { replace: true }
                        );
                      }}
                    />
                  </TableCell>
                </TableRow>
              )}
          </TableFooter>
        </Table>
      </TableContainer>
    </PaginaBase>
  );
};
