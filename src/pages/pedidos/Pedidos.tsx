import { useMemo, useEffect } from "react";
import { PaginaBase } from "../../ui/layouts";
import { FerramentasDeListagem } from "../../ui/components";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { ClientesService } from "../../data/services/api";
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
import {
  IPedido,
  PedidosService,
} from "../../data/services/api/modules/pedidos";
import { OrcamentosService } from "../../data/services/api/modules/orcamentos";
import { Actions } from "../../ui/components/ferramentasDeListagem/Actions";

export const Pedidos = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();

  const [rows, setRows] = useState<IPedido[]>([]);
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

      const result = await PedidosService.getAll({
        page: pagina,
        filter: busca,
      });

      if (result instanceof Error) {
        alert(result.message);
        return;
      }

      const pedidosData = await Promise.all(
        result.data.map(async (pedido: IPedido) => {
          try {
            const result2 = await OrcamentosService.getById(pedido.idOrcamento);

            if (result2 instanceof Error) {
              alert(result2.message);
              return null;
            }

            pedido.orcamento = result2;
            try {
              const result3 = await ClientesService.getById(
                pedido.orcamento.idCliente
              );
              if (result3 instanceof Error) {
                alert(result3.message);
                return;
              }
              pedido.orcamento.cliente = result3;
            } catch (error) {}
            return pedido;
          } catch (error) {
            return null;
          }
        })
      );
      setRows(pedidosData);
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
      PedidosService.deleteById(id).then((result) => {
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
      titulo="Pedidos"
      barraDeFerramentas={
        <FerramentasDeListagem
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
              <TableCell style={{ fontWeight: "bold" }}>
                Codigo (Pedido)
              </TableCell>
              <TableCell style={{ fontWeight: "bold" }}>
                Codigo (Orçamento)
              </TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Cliente</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Valor Total</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Valor Pago</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>
                Porcentagem Pago
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <Actions
                  id={row.id}
                  showListButton
                  handleDelete={handleDelete}
                  handleShowList={() => {
                    navigate(`${location.pathname}/${row.id}/produtos`);
                  }}
                  toolTipListButton="Listar produtos"
                />
                <TableCell>
                  <Typography>{row.id}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{row.orcamento.id}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>
                    {row.orcamento.cliente.nome ||
                      row.orcamento.cliente.nomeFantasia ||
                      row.orcamento.cliente.razaoSocial ||
                      ""}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>
                    {row.status.toString() == "Em_Processo"
                      ? "Em Processo"
                      : row.status}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>
                    {(
                      row.orcamento.totalMaoObra + row.orcamento.totalMateriais
                    ).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                      minimumFractionDigits: 2,
                    })}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>
                    {row.pagamento.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                      minimumFractionDigits: 2,
                    })}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>
                    {(
                      (row.pagamento /
                        (row.orcamento?.totalMaoObra +
                          row.orcamento?.totalMateriais)) *
                      100
                    ).toFixed(2) + "%"}
                  </Typography>
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
