import { useMemo, useEffect } from "react";
import { PaginaBase } from "../../ui/layouts";
import { FerramentasDeListagem } from "../../ui/components";
import { useSearchParams, useLocation, useParams } from "react-router-dom";
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
} from "@mui/material";
import { Environment } from "../../data/environment";
import {
  IListaInsumo,
  ListaInsumosService,
} from "../../data/services/api/modules/listaInsumos";
import {
  CategoriasService,
  FornecedoresService,
  VariantesService,
} from "../../data/services/api";
import { CotacoesService } from "../../data/services/api/modules/cotacoes";

export const InsumosProduto = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [rows, setRows] = useState<IListaInsumo[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { idProduto } = useParams();

  const location = useLocation();
  const qtdProd = location.state.qtdProd;
  const tituloProd = location.state.tituloProd;

  const busca = useMemo(() => {
    return searchParams.get("busca") || "";
  }, [searchParams]);

  const pagina = useMemo(() => {
    return Number(searchParams.get("pagina") || "1");
  }, [searchParams]);

  const setDados = async () => {
    try {
      setIsLoading(true);

      const result = await ListaInsumosService.getListaByIdProduto(
        { page: pagina, filter: busca },
        Number(idProduto)
      );

      if (result instanceof Error) {
        alert(result.message);
        return;
      }

      const listaInsumosData = await Promise.all(
        result.data.map(async (listaInsumos: IListaInsumo) => {
          const fetchInsumos = async () => {
            const result2 = await VariantesService.getById(
              listaInsumos.idVariante
            );

            if (result2 instanceof Error) {
              alert(result2.message);
              return null;
            }
            listaInsumos.variante = result2;

            if (!listaInsumos.variante.insumo.idCategoria) return;

            const result3 = await CategoriasService.getById(
              listaInsumos.variante.insumo.idCategoria
            );

            if (result3 instanceof Error) {
              alert(result3.message);
              return null;
            }

            listaInsumos.variante.insumo.categoria = result3;

            return listaInsumos;
          };

          const dataInsumos = await fetchInsumos();
          if (dataInsumos) {
            listaInsumos = dataInsumos;
          }

          const fetchCotacoes = async () => {
            if (!listaInsumos.idCotacao) return;

            const result20 = await CotacoesService.getById(
              listaInsumos.idCotacao
            );

            if (result20 instanceof Error) {
              alert(result20.message);
              return null;
            }
            listaInsumos.cotacao = result20;

            const result30 = await FornecedoresService.getById(
              listaInsumos.cotacao?.idFornecedor
            );

            if (result30 instanceof Error) {
              alert(result30.message);
              return null;
            }

            listaInsumos.cotacao.fornecedor = result30;

            return listaInsumos;
          };
          const dataCotacoes = await fetchCotacoes();
          if (dataCotacoes) {
            listaInsumos = dataCotacoes;
          }
          return listaInsumos;
        })
      );
      setRows(listaInsumosData);
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
      ListaInsumosService.deleteById(id).then((result) => {
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
      titulo={`Insumos do produto: ${tituloProd}`}
      barraDeFerramentas={
        <FerramentasDeListagem
          mostrarInputBusca
          textoDaBusca={busca}
          onChangeBuscaTexto={(texto) =>
            setSearchParams({ busca: texto, pagina: "1" }, { replace: true })
          }
          mostrarBotaoNovo={false}
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
              <TableCell style={{ fontWeight: "bold" }}>Titulo</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Variação</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>
                Quantidade (1 produto)
              </TableCell>
              <TableCell style={{ fontWeight: "bold" }}>
                Quantidade (total)
              </TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Categoria</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Descrição</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Fornecedor</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Cotação</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>
                Valor (1 produto)
              </TableCell>
              <TableCell style={{ fontWeight: "bold" }}>
                Valor (total)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Typography>{row.variante?.insumo?.titulo}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{row.variante?.variante}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{row.quantidade}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{Number(qtdProd) * row.quantidade}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>
                    {row.variante?.insumo?.categoria?.titulo}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{row.variante?.insumo?.descricao}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>
                    {row.cotacao?.fornecedor?.nome ??
                      row.cotacao?.fornecedor?.razaoSocial ??
                      row.cotacao?.fornecedor?.nomeFantasia}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>
                    {(row.cotacao?.valor).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                      minimumFractionDigits: 2,
                    })}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>
                    {(
                      row.quantidade * (row.cotacao?.valor ?? 0)
                    ).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                      minimumFractionDigits: 2,
                    })}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>
                    {(
                      Number(qtdProd) *
                      row.quantidade *
                      (row.cotacao?.valor ?? 0)
                    ).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                      minimumFractionDigits: 2,
                    })}
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
