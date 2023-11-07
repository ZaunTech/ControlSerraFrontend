import { useMemo, useEffect } from "react";
import { PaginaBase } from "../../ui/layouts";
import { FerramentasDaListagem } from "../../ui/components";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import {
  FornecedoresService,
  IFornecedor,
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
  Autocomplete,
  TextField,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { Environment } from "../../data/environment";
import {
  CotacoesService,
  ICotacao,
} from "../../data/services/api/modules/cotacoes";
import React from "react";
import { Actions } from "../../ui/components/ferramentasDeListagem/Actions";
import { format, parseISO } from "date-fns";

interface IPesquisa {
  setFiltro: (text: string) => void;
  setFiltroId: (id: number | undefined) => void;
}

const Pesquisas: React.FC<IPesquisa> = ({ setFiltro, setFiltroId }) => {
  const [opcoesFornecedor, setOpcoesFornecedor] = useState<IFornecedor[]>([]);
  const [opcoesInsumos, setOpcoesInsumos] = useState<IInsumo[]>([]);

  useEffect(() => {
    FornecedoresService.getAll({perPage:0})
      .then((response) => {
        if (response instanceof Error) {
          return;
        }

        if (response && Array.isArray(response.data)) {
          const FornecedoresMapeados = response.data;
          setOpcoesFornecedor(FornecedoresMapeados);
        } else {
        }
      })
      .catch((error) => { });
  }, []);

  useEffect(() => {
    InsumosService.getAll({perPage:0})
      .then((response) => {
        if (response instanceof Error) {
          return;
        }

        if (response && Array.isArray(response.data)) {
          const InsumosMapeados = response.data;
          setOpcoesInsumos(InsumosMapeados);
        } else {
        }
      })
      .catch((error) => { });
  }, []);

  const [tipo, setTipo] = React.useState<string>("Todos");

  const [idFiltro, setIdFiltro] = useState<number | undefined>();

  const handleChange = (event: SelectChangeEvent) => {
    setTipo(event.target.value as string);
  };

  useEffect(() => {
    setFiltro(tipo);
  }, [tipo]);

  useEffect(() => {
    setFiltroId(idFiltro);
  }, [idFiltro]);

  return (
    <>
      <Select value={tipo} onChange={handleChange} size="small">
        <MenuItem value={"Todos"}>Todos</MenuItem>
        <MenuItem value={"Fornecedor"}>Fornecedor</MenuItem>
        <MenuItem value={"Insumo"}>Insumo</MenuItem>
      </Select>

      {tipo === "Fornecedor" ? (
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={opcoesFornecedor}
          getOptionLabel={(option) =>
            option.razaoSocial ?? option.nomeFantasia ?? option.nome ?? ""
          }
          sx={{ width: 225 }}
          size="small"
          renderInput={(params) => <TextField {...params} />}
          onChange={(_, value) => {
            if (value !== null) {
              setIdFiltro(value.id);
            }
          }}
        />
      ) : (
        ""
      )}
      {tipo === "Insumo" ? (
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={opcoesInsumos}
          getOptionLabel={(option) => option.titulo ?? ""}
          sx={{ width: 225 }}
          size="small"
          renderInput={(params) => <TextField {...params} />}
          onChange={(_, value) => {
            if (value !== null) {
              setIdFiltro(value.id);
            }
          }}
        />
      ) : (
        ""
      )}
    </>
  );
};

export const Cotacoes = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [rows, setRows] = useState<ICotacao[]>([]);
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

  const [filtro, setFiltro] = useState<string>();
  const [filtroId, setFiltroId] = useState<number>();

  const setDados = async () => {
    try {
      setIsLoading(true);
      let result;

      if (filtro === "Insumo" && filtroId != undefined) {
        result = await CotacoesService.getByInsumo(filtroId, pagina, busca);
      } else if (filtro === "Fornecedor" && filtroId != undefined) {
        result = await CotacoesService.getByFornecdor(filtroId, pagina, busca);
      } else {
        result = await CotacoesService.getAll({page:pagina, filter: busca});
      }

      if (result instanceof Error) {
        alert(result.message);
        return;
      }

      const cotacoesData = await Promise.all(
        result.data.map(async (cotacao: ICotacao) => {
          try {
            const result2 = await FornecedoresService.getById(
              cotacao.idFornecedor
            );

            if (result2 instanceof Error) {
              alert(result2.message);
              return null;
            }

            const result3 = await InsumosService.getById(cotacao.idInsumo);

            if (result3 instanceof Error) {
              alert(result3.message);
              return null;
            }

            cotacao.fornecedor = result2;
            cotacao.insumo = result3;

            return cotacao;
          } catch (error) {
            return null;
          }
        })
      );
      setRows(cotacoesData);
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
  }, [busca, pagina, filtro, filtroId]);

  const handleDelete = (id: number) => {
    if (confirm("Você realmente quer apagar?")) {
      CotacoesService.deleteById(id).then((result) => {
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
      titulo="Cotações"
      barraDeFerramentas={
        <FerramentasDaListagem
          mostrarInputBusca
          textoDaBusca={busca}
          onChangeBuscaTexto={(texto) =>
            setSearchParams({ busca: texto, pagina: "1" }, { replace: true })
          }
          onClickBotaoNovo={() => navigate(`${location.pathname}/novo`)}
          componentePersonalizado={
            <Pesquisas setFiltro={setFiltro} setFiltroId={setFiltroId} />
          }
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
              <TableCell style={{ fontWeight: "bold" }}>Fornecedor</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Insumo</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Valor</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Data</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              return (
                <TableRow key={row.id}>
                  <Actions
                    id={row.id}

                    handleDelete={handleDelete}
                    handleShowList={() => {
                      navigate(`${location.pathname}/${row.id}`);
                    }}
                  />
                  <TableCell>
                    <Typography>
                      {row.fornecedor?.nomeFantasia ||
                        row.fornecedor?.nome ||
                        row.fornecedor?.razaoSocial}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{row.insumo?.titulo || "Vazop"}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{row.valor.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      minimumFractionDigits: 2,
                    })}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>                    {format(
                      parseISO(String(row.data)),
                      "dd/MM/yyyy HH:mm"
                    )}</Typography>
                  </TableCell>
                </TableRow>
              );
            })}
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
