import { useMemo, useEffect, forwardRef, Ref, useRef } from "react";
import { PaginaBase } from "../../../ui/layouts";
import { FerramentasDaListagem } from "../../../ui/components";
import {
  useNavigate,
  useSearchParams,
  useLocation,
  useParams,
} from "react-router-dom";
import { useDebounce } from "../../../data/hooks";
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
  Box,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { Environment } from "../../../data/environment";
import {
  IListaInsumo,
  ListaInsumosService,
} from "../../../data/services/api/modules/listaInsumos";
import {
  CategoriasService,
  FornecedoresService,
  IFornecedor,
  InsumosService,
  VariantesService,
} from "../../../data/services/api";
import { CotacoesService } from "../../../data/services/api/modules/cotacoes";
import { Actions } from "../../../ui/components/ferramentasDeListagem/Actions";
import generatePDF from "react-to-pdf";

interface IPDF {
  idFornecedor: number;
  referencia: Ref<HTMLDivElement | null>;
  insumos: IListaInsumo[];
}

const PDF = forwardRef(({ idFornecedor, referencia, insumos }: IPDF) => {
  const [minhaEmpresa, setMinhaEmpresa] = useState<IFornecedor>();
  const [fornecedor, setFornecedor] = useState<IFornecedor>();
  useEffect(() => {
    FornecedoresService.getById(1).then((result) => {
      if (result instanceof Error) {
        return;
      }
      setMinhaEmpresa(result);
    });
    FornecedoresService.getById(idFornecedor).then((result) => {
      if (result instanceof Error) {
        return;
      }
      setFornecedor(result);
    });
  });
  return (
    <div
      style={{
        position: "absolute",
        left: "-9999px",
        top: "-9999px",
        width: "60%",
        height: "60%",
      }}
    >
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ m: 1, width: "auto" }}
        ref={referencia}
        style={{
          padding: "20px",
          margin: "20px",
        }}
      >
        <Box display={"flex"} flexDirection={"column"} gap={"10px"}>
          {minhaEmpresa && (
            <Card sx={{ minWidth: 275, border: 1 }}>
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Empresa Solicitante
                </Typography>
                <Typography variant="h5" component="div">
                  {minhaEmpresa.nome ??
                    minhaEmpresa.nomeFantasia ??
                    minhaEmpresa.razaoSocial}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Contato
                </Typography>
                <Typography variant="body2">{minhaEmpresa.telefone}</Typography>
                <Typography variant="body2">{minhaEmpresa.email}</Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Endereço
                </Typography>
                <Typography variant="body2">
                  {`${minhaEmpresa.rua},${minhaEmpresa.numero}-${minhaEmpresa.bairro},${minhaEmpresa.cidade}-${minhaEmpresa.estado}`}
                </Typography>
              </CardContent>
            </Card>
          )}
          {fornecedor && (
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Empresa Solicitada
                </Typography>
                <Typography variant="h5" component="div">
                  {fornecedor.nome ??
                    fornecedor.nomeFantasia ??
                    fornecedor.razaoSocial}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Contato
                </Typography>
                <Typography variant="body2">{fornecedor.telefone}</Typography>
                <Typography variant="body2">{fornecedor.email}</Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Endereço
                </Typography>
                <Typography variant="body2">
                  {`${fornecedor.rua},${fornecedor.numero}-${fornecedor.bairro},${fornecedor.cidade}-${fornecedor.estado}`}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
        <Box
          sx={{ border: 1 }}
          display={"flex"}
          flexDirection={"column"}
          padding={"10px"}
          gap={"10px"}
          marginTop={"10px"}
        >
          <Typography variant="h5">{`Solicitação de orçamento`}</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: "bold" }}>Titulo</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Variação</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Quantidade</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>
                  Valor Unitario
                </TableCell>
                <TableCell style={{ fontWeight: "bold" }}>
                  Valor Total
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {insumos.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Typography>{row.variante.insumo?.titulo}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{row.variante.variante}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{row.quantidade}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography></Typography>
                  </TableCell>
                  <TableCell>
                    <Typography></Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </TableContainer>
    </div>
  );
});

export const InsumosDeUmProdutoOrcamento = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();

  const [rows, setRows] = useState<IListaInsumo[]>([]);
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

  const setDados = async () => {
    try {
      setIsLoading(true);

      const result = await ListaInsumosService.getListaByIdProduto(
        { page: pagina, filter: busca },
        Number(id)
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

  const pdfRef = useRef(null);

  const qtdProd = location.state.qtdProd;
  const tituloProd = location.state.tituloProd;
  return (
    <PaginaBase
      titulo={`Insumos do produto: ${tituloProd}`}
      barraDeFerramentas={
        <FerramentasDaListagem
          mostrarInputBusca
          textoDaBusca={busca}
          onChangeBuscaTexto={(texto) =>
            setSearchParams({ busca: texto, pagina: "1" }, { replace: true })
          }
          onClickBotaoNovo={() => navigate(`${location.pathname}/novo`)}
          mostrarBotaoVoltar
          componentePersonalizado={
            <Button
              startIcon={<Icon>picture_as_pdf</Icon>}
              onClick={() => {
                generatePDF(pdfRef, { filename: "page.pdf" });
              }}
              variant="contained"
            >
              Gerar PDF
            </Button>
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
                <Actions
                  id={row.id}
                  showPersoButton
                  persoButtonIcon="attach_money"
                  persoButtonToolTipText="Selecionar Cotação"
                  handlePersoButton={() => {
                    navigate(`${location.pathname}/${row.id}/cotar`);
                  }}
                />

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
                    {row.cotacao != null?   (row.cotacao?.valor).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                      minimumFractionDigits: 2,
                    }) : 0}
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
      <PDF idFornecedor={Number(id)} referencia={pdfRef} insumos={rows} />
    </PaginaBase>
  );
};
