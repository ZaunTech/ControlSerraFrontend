import { useMemo, useEffect } from "react";
import { PaginaBase } from "../../ui/layouts";
import { FerramentasDaListagem } from "../../ui/components";
import {
  useNavigate,
  useSearchParams,
  useLocation,
  useParams,
} from "react-router-dom";
import {
  IInsumo,
  InsumosService,
  ProdutosBaseService,
} from "../../data/services/api";
import { useDebounce } from "../../data/hooks";
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
  Button,
} from "@mui/material";
import { Environment } from "../../data/environment";
import {
  IProduto,
  ProdutosService,
} from "../../data/services/api/modules/produtos";
import { OrcamentosService } from "../../data/services/api/modules/orcamentos";

const BotoesOrcamento: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <>
      <Button
        variant="contained"
        onClick={() => navigate(`${location.pathname}/CriarProduto`)}
      >
        Novo Produto
      </Button>
      <Button
        variant="contained"
        onClick={() => navigate(`${location.pathname}/AddProdutoBase`)}
      >
        Add Produto Base
      </Button>
    </>
  );
};

const Orcamento = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();

  const [rows, setRows] = useState<IProduto[]>([]);
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

  useEffect(() => {
    setIsLoading(true);
    debounce(() => {
      ProdutosService.getAll(pagina, busca).then((result) => {
        if (result instanceof Error) {
          alert(result.message);
          return;
        }
        setRows(result.data);
        setTotalCount(result.totalCount);
        setIsLoading(false);
      });
    });
  }, [busca, pagina]);

  const handleDelete = (id: number) => {
    if (confirm("Você realmente quer apagar?")) {
      ProdutosService.deleteById(id).then((result) => {
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
      titulo={`Orçamento ${id}`}
      barraDeFerramentas={
        <FerramentasDaListagem
          mostrarInputBusca
          textoDaBusca={busca}
          onChangeBuscaTexto={(texto) =>
            setSearchParams({ busca: texto, pagina: "1" }, { replace: true })
          }
          mostrarBotaoNovo={false}
          mostrarBotaoVoltar
          componentePersonalizado={<BotoesOrcamento />}
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
              <TableCell style={{ fontWeight: "bold" }}>
                Valor Unitario
              </TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Valor Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Typography>
                    <IconButton
                      onClick={() =>
                        navigate(`${location.pathname}/produtos/${row.id}`)
                      }
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
                  <Typography>{row.titulo}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{row.quantidade}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{row.valorUnitario}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{row.valorUnitario * row.quantidade}</Typography>
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

export default Orcamento;
