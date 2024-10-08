import { useMemo, useEffect } from "react";
import { PaginaBase } from "../../ui/layouts";
import { FerramentasDeListagem } from "../../ui/components";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { ClientesService } from "../../data/services/api";
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
  IOrcamento,
  OrcamentosService,
} from "../../data/services/api/modules/orcamentos";
import { Actions } from "../../ui/components/listTools/Actions";
import { format, parseISO } from "date-fns";

const opcoesDeFormatacao = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZoneName: "short",
};

export const Orcamentos = () => {
  const [searchParams, setSearchParams] = useSearchParams();

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
  const setDados = async () => {
    try {
      setIsLoading(true);

      const result = await OrcamentosService.getAll({
        page: pagina,
        filter: busca,
      });

      if (result instanceof Error) {
        alert(result.message);
        return;
      }

      const orcamentosData = await Promise.all(
        result.data.map(async (orcamento: IOrcamento) => {
          try {
            const result2 = await ClientesService.getById(orcamento.idCliente);

            if (result2 instanceof Error) {
              alert(result2.message);
              return null;
            }

            orcamento.cliente = result2;
            return orcamento;
          } catch (error) {
            return null;
          }
        })
      );
      setRows(orcamentosData);
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
              <TableCell style={{ fontWeight: "bold" }}>Codigo</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>
                Data Solicitado
              </TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Cliente</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Validade</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Valor Total</TableCell>
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
                  <Typography>
                    {format(
                      parseISO(String(row.dataOrcamento)),
                      "dd/MM/yyyy HH:mm"
                    )}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>
                    {row.cliente.nome ??
                      row.cliente.nomeFantasia ??
                      row.cliente.razaoSocial}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{row.status.toString() == "Em_Processo"? "Em Processo" : row.status }</Typography>
                </TableCell>
                <TableCell>
                  <Typography>
                    {format(parseISO(String(row.validade)), "dd/MM/yyyy HH:mm")}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>
                    {(row.totalMaoObra + row.totalMateriais).toLocaleString(
                      "pt-BR",
                      {
                        style: "currency",
                        currency: "BRL",
                        minimumFractionDigits: 2,
                      }
                    )}
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
