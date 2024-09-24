import { useMemo, useEffect } from "react";
import { PaginaBase } from "../../ui/layouts";
import { FerramentasDeListagem } from "../../ui/components";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import {
  CategoriasService,
  IInsumo,
  InsumosService,
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
} from "@mui/material";
import { Environment } from "../../data/environment";
import { Actions } from "../../ui/components/FerramentasDeListagem/Actions";

export const Insumos = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();

  const [rows, setRows] = useState<IInsumo[]>([]);
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

  const setDados = async () => {
    try {
      setIsLoading(true);

      const result = await InsumosService.getAll({
        page: pagina,
        filter: busca,
      });

      if (result instanceof Error) {
        alert(result.message);
        return;
      }

      const insumosData = await Promise.all(
        result.data.map(async (insumo: IInsumo) => {
          try {
            if (!insumo.idCategoria) {
              return insumo;
            }
            const result2 = await CategoriasService.getById(insumo.idCategoria);

            if (result2 instanceof Error) {
              alert(result2.message);
              return insumo;
            }

            insumo.categoria = result2;
            return insumo;
          } catch (error) {
            return null;
          }
        })
      );
      setTotalCount(result.totalCount);
      setRows(insumosData);
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
      InsumosService.deleteById(id).then((result) => {
        if (result instanceof Error) {
          alert(result.message);
          return;
        }
        setRows((oldRows) => [...oldRows.filter((oldRow) => oldRow.id !== id)]);
        alert("Registro apagado com sucesso");
      });
    }
  };

  useEffect(() => {
  }, [rows]);

  return (
    <PaginaBase
      titulo="Insumos"
      barraDeFerramentas={
        <FerramentasDeListagem
          mostrarInputBusca
          textoDaBusca={busca}
          onChangeBuscaTexto={(texto) =>
            setSearchParams({ busca: texto, pagina: "1" }, { replace: true })
          }
          onClickBotaoNovo={() => navigate(`${location.pathname}/novo`)}
        />
      }>
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ m: 1, width: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bold" }}>Ações</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Titulo</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Categoria</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>
                Unidade de Medida
              </TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Descrição</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <Actions
                  id={row.id}
                  handleDelete={handleDelete}
                  handleShowList={() => {
                    navigate(`${location.pathname}/${row.id}/variantes`);
                  }}
                  showListButton
                  toolTipListButton="Listar Variações"
                />
                <TableCell>
                  <Typography>{row.titulo}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{row.categoria?.titulo}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{row.unidadeMedida}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{row.descricao}</Typography>
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
