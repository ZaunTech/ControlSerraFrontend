import { useMemo, useEffect } from "react";
import { PaginaBase } from "../../ui/layouts";
import { FerramentasDaListagem } from "../../ui/components";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { IOrcamento, OrcamentosService } from "../../data/services/api";
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
} from "@mui/material";
import { Environment } from "../../data/environment";

const Orcamentos = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();

  const [rows, setRows] = useState<IOrcamento[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const busca = useMemo(() => {
    return searchParams.get("busca") || "";
  }, [searchParams]);

  const pagina = useMemo(() => {
    return Number(searchParams.get("pagina") || "1");
  }, [searchParams]);

  useEffect(() => {
    setIsLoading(true);
    debounce(() => {
      OrcamentosService.getAll(pagina, busca).then((result) => {
        if (result instanceof Error) {
          alert(result.message);
          return;
        }
        console.log(result);
        setRows(result.data);
        setTotalCount(result.totalCount);
        setIsLoading(false);
      });
    });
  }, [busca, pagina]);

  const handleDelete = (id: number) => {
    if (confirm("Você realmente quer apagar?")) {
      OrcamentosService.deleteById(id).then((result) => {
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
      titulo="Orçamentos"
      barraDeFerramentas={
        <FerramentasDaListagem
          mostrarInputBusca
          textoDaBusca={busca}
          onChangeBuscaTexto={(texto) =>
            setSearchParams({ busca: texto, pagina: "1" }, { replace: true })
          }
          onClickBotaoNovo={() => navigate(`${location.pathname}/novo`)}
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
              <TableCell style={{ fontWeight: "bold" }}>Id</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Cliente</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Typography>
                    <IconButton
                      onClick={() =>
                        navigate(`${location.pathname}/${row.id}/editar`)
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
                  <Typography>{row.id}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{row.cliente.nome || row.cliente.nomeFantasia || row.cliente.razaoSocial}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{row.status}</Typography>
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

export default Orcamentos;
