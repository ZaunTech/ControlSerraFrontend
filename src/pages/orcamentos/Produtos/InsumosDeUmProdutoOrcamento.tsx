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
} from "@mui/material";
import { Environment } from "../../../data/environment";
import {
  IListaInsumo,
  ListaInsumosService,
} from "../../../data/services/api/modules/listaInsumos";
import {
  CategoriasService,
  FornecedoresService,
  InsumosService,
} from "../../../data/services/api";
import { CotacoesService } from "../../../data/services/api/modules/cotacoes";
import { Actions } from "../../../ui/components/ferramentasDeListagem/Actions";
import generatePDF from 'react-to-pdf';

const PDF = forwardRef(({ data }: { data: IListaInsumo[] }, referencia: Ref<HTMLDivElement | null>) => {
  return (
    <div
      style={{
        position: "absolute",
        left: "-9999px",
        top: "-9999px",
        width: "100%"
      }}>
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ m: 1, width: "auto" }}
        ref={referencia}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bold" }}>Titulo</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>
                Variação
              </TableCell>
              <TableCell style={{ fontWeight: "bold" }}>
                Quantidade
              </TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Valor Unitario</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Valor Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Typography>{row.insumo?.titulo}</Typography>
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
      </TableContainer>
    </div>
  )
}
)

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

      const result = await ListaInsumosService.getListaByIdProduto({ page: pagina, filter: busca }, Number(id));

      if (result instanceof Error) {
        alert(result.message);
        return;
      }

      const listaInsumosData = await Promise.all(
        result.data.map(async (listaInsumos: IListaInsumo) => {
          const fetchInsumos = async () => {
            const result2 = await InsumosService.getById(listaInsumos.idInsumo);

            if (result2 instanceof Error) {
              alert(result2.message);
              return null;
            }
            listaInsumos.insumo = result2;

            if (!listaInsumos.insumo.idCategoria) return;

            const result3 = await CategoriasService.getById(
              listaInsumos.insumo.idCategoria
            );

            if (result3 instanceof Error) {
              alert(result3.message);
              return null;
            }

            listaInsumos.insumo.categoria = result3;

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

  return (
    <PaginaBase
      titulo={`Insumos do produto: ${id}`}
      barraDeFerramentas={
        <FerramentasDaListagem
          mostrarInputBusca
          textoDaBusca={busca}
          onChangeBuscaTexto={(texto) =>
            setSearchParams({ busca: texto, pagina: "1" }, { replace: true })
          }
          onClickBotaoNovo={() => navigate(`${location.pathname}/novo`)}
          mostrarBotaoVoltar
          componentePersonalizado={<IconButton onClick={() => {
            generatePDF(pdfRef, { filename: 'page.pdf' })
          }}><Icon>picture_as_pdf</Icon></IconButton>}
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
              <TableCell style={{ fontWeight: "bold" }}>Categoria</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Titulo</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Quantidade</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>
                Variação
              </TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Descrição</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Fornecedor</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Valor Unitario</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Valor Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>

                <Actions
                  id={row.id}
                  showPersoButton
                  persoButtonIcon="attach_money"

                  handlePersoButton={() => { navigate(`${location.pathname}/${row.id}/cotar`) }}
                />
                <TableCell>
                  <Typography>{row.insumo?.categoria?.titulo}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{row.insumo?.titulo}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>Quantidade</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{row.insumo?.unidadeMedida}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{row.insumo?.descricao}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>
                    {row.cotacao?.fornecedor?.nome ??
                      row.cotacao?.fornecedor?.razaoSocial ??
                      row.cotacao?.fornecedor?.nomeFantasia}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{row.cotacao?.valor}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>
                    {row.quantidade * (row.cotacao?.valor ?? 0)}
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
      <PDF ref={pdfRef} data={rows} />
    </PaginaBase >
  );
};
