import { useMemo, useEffect } from "react";
import { PaginaBase } from "../../../../ui/layouts";
import { FerramentasDeListagem } from "../../../../ui/components";
import {
  useNavigate,
  useSearchParams,
  useLocation,
  useParams,
} from "react-router-dom";
import {
  FornecedoresService,
  IFornecedor,
  IInsumo,
  IVariante,
  InsumosService,
  ProdutosService,
  VariantesService,
} from "../../../../data/services/api";
import { useDebounce } from "../../../../data/hooks";
import { useState } from "react";
import { format, parseISO } from "date-fns";
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
import { Environment } from "../../../../data/environment";
import {
  CotacoesService,
  ICotacao,
} from "../../../../data/services/api/modules/cotacoes";
import React from "react";
import { Actions } from "../../../../ui/components/ferramentasDeListagem/Actions";
import { ListaInsumosService } from "../../../../data/services/api/modules/listaInsumos";
import { ProdutoBase } from "../../../produtosBase";

interface IPesquisa {
  setFiltro: (text: string) => void;
  setFiltroId: (id: number | undefined) => void;
}

const Pesquisas: React.FC<IPesquisa> = ({ setFiltro, setFiltroId }) => {
  const [opcoesFornecedor, setOpcoesFornecedor] = useState<IFornecedor[]>([]);
  const [opcoesInsumos, setOpcoesInsumos] = useState<IVariante[]>([]);

  useEffect(() => {
    FornecedoresService.getAll()
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
      .catch((error) => {});
  }, []);

  useEffect(() => {
    VariantesService.getAll()
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
      .catch((error) => {});
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
    </>
  );
};

export const CotacoesDeUmInsumo = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [rows, setRows] = useState<ICotacao[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const { idItemListaInsumos } = useParams();
  const location = useLocation();

  const busca = useMemo(() => {
    return searchParams.get("busca") || "";
  }, [searchParams]);

  const pagina = useMemo(() => {
    return Number(searchParams.get("pagina") || "1");
  }, [searchParams]);

  const [filtro, setFiltro] = useState<string>();
  const [filtroId, setFiltroId] = useState<number>();

  async function idVaraintes(id: number) {
    try {
      const result = await ListaInsumosService.getById(id);
      // @ts-ignore
      return result.idVariante;
    } catch (erro) {
      return null;
    }
  }

  const setDados = async () => {
    try {
      setIsLoading(true);
      let result;

      const idVarianteValue = await idVaraintes(Number(idItemListaInsumos));
      if (filtro === "Fornecedor" && filtroId != undefined) {
        result = await CotacoesService.getAll(
          { page: pagina, filter: busca },
          Number(idVarianteValue),
          filtroId
        );
      } else {
        result = await CotacoesService.getAll(
          { page: pagina, filter: busca },
          Number(idVarianteValue)
        );
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

            const result3 = await VariantesService.getById(cotacao.idVariante);

            if (result3 instanceof Error) {
              alert(result3.message);
              return null;
            }

            cotacao.fornecedor = result2;
            cotacao.variante = result3;

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
        <FerramentasDeListagem
          mostrarInputBusca
          textoDaBusca={busca}
          onChangeBuscaTexto={(texto) =>
            setSearchParams({ busca: texto, pagina: "1" }, { replace: true })
          }
          onClickBotaoNovo={() => navigate(`${location.pathname}/novo`)}
          componentePersonalizado={
            <Pesquisas setFiltro={setFiltro} setFiltroId={setFiltroId} />
          }
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
                    showPersoButton
                    persoButtonText="Selecionar"
                    persoButtonIcon="check"
                    handlePersoButton={() => {
                      if (idItemListaInsumos)
                        ListaInsumosService.setCotacao({
                          idItemListaInsumo: Number(idItemListaInsumos),
                          idCotacao: row.id,
                        }).then((res) => {
                          if (res instanceof Error) {
                            return;
                          }
                          navigate(-1);
                        });
                    }}
                    showDeleteButton={false}
                    showEditButton={false}
                  />
                  <TableCell>
                    <Typography>
                      {row.fornecedor?.nomeFantasia ||
                        row.fornecedor?.nome ||
                        row.fornecedor?.razaoSocial}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      {row.variante?.insumo?.titulo + row.variante?.variante ||
                        "Vazop"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{row.valor}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      {" "}
                      {format(parseISO(String(row.data)), "dd/MM/yyyy HH:mm")}
                    </Typography>
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
