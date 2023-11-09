import { useMemo, useEffect, useRef, forwardRef, Ref } from "react";
import { PaginaBase } from "../../ui/layouts";
import { FerramentasDaListagem } from "../../ui/components";
import {
  useNavigate,
  useSearchParams,
  useLocation,
  useParams,
} from "react-router-dom";
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
  Box,
  Card,
  CardContent,
} from "@mui/material";
import { Environment } from "../../data/environment";
import {
  IProduto,
  ProdutosService,
} from "../../data/services/api/modules/produtos";
import { Actions } from "../../ui/components/ferramentasDeListagem/Actions";
import generatePDF from "react-to-pdf";
import { FornecedoresService, ICliente, IFornecedor } from "../../data/services/api";
import { OrcamentosService } from "../../data/services/api/modules/orcamentos";

interface IPDF {
  id: number,
  referencia: Ref<HTMLDivElement | null>
}

const PDF = forwardRef(({ id, referencia }: IPDF) => {
  const [fornecedor, setFornecedor] = useState<IFornecedor>();
  const [cliente, setCliente] = useState<ICliente>();
  const [produtos, setProdutos] = useState<IProduto[]>();
  useEffect(() => {
    OrcamentosService.getFullById(id).then((result) => {
      if (result instanceof Error) {
        return
      }
      setCliente(result.cliente);
      setProdutos(result.produtos);
    })
    FornecedoresService.getById(1).then((result) => {
      if (result instanceof Error) {
        return
      }
      setFornecedor(result)
    })
  })
  return (
    <div
      style={{
        position: "absolute",
        left: "-9999px",
        top: "-9999px",
        width: "100%",
        height: "100%"
      }}>

      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ m: 1, width: "auto" }}
        ref={referencia}
        style={{
          padding: '20px',
          margin: '20px'
        }}
      >
        <Box display={'flex'} flexDirection={'column'} gap={'10px'}>
          {fornecedor && (
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  Empresa
                </Typography>
                <Typography variant="h5" component="div">
                  {fornecedor.nome ??
                    fornecedor.nomeFantasia ??
                    fornecedor.razaoSocial}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Contato
                </Typography>
                <Typography variant="body2">
                  {fornecedor.telefone}
                </Typography>
                <Typography variant="body2">
                  {fornecedor.email}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Endereço
                </Typography>
                <Typography variant="body2">
                  {`${fornecedor.rua},${fornecedor.numero}-${fornecedor.bairro},${fornecedor.cidade}-${fornecedor.estado}`}
                </Typography>
              </CardContent>
            </Card>
          )
          }
          {cliente && (<Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Cliente
              </Typography>
              <Typography variant="h5" component="div">
                {cliente.nome ??
                  cliente.nomeFantasia ??
                  cliente.razaoSocial}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Contato
              </Typography>
              <Typography variant="body2">
                {cliente.telefone}
              </Typography>
              <Typography variant="body2">
                {cliente.email}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Endereço
              </Typography>
              <Typography variant="body2">
                {`${cliente.rua},${cliente.numero}-${cliente.bairro},${cliente.cidade}-${cliente.estado}`}
              </Typography>
            </CardContent>
          </Card>)}
          <Typography variant="h5">
            {`Orçamento`}
          </Typography>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bold" }}>Titulo</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Descrição</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Quantidade</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>
                Valor Unitario
              </TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Valor Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {produtos && produtos.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Typography>{row.titulo}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{row.observacoes}</Typography>
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
        </Table>
      </TableContainer>
    </div >
  )
}
)

const BotoesOrcamento: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <>
      <Button
        variant="contained"
        onClick={() => navigate(`${location.pathname}/CriarProduto`)}
        size="medium"
      >
        <Typography
          whiteSpace={"nowrap"}
          textOverflow={"ellipsis"}
          overflow={"hidden"}
          variant="inherit"
        >
          Novo Produto
        </Typography>
      </Button>
      <Button
        variant="contained"
        onClick={() => navigate(`${location.pathname}/AddProdutoBase`)}
        size="medium"
      >
        <Typography
          whiteSpace={"nowrap"}
          textOverflow={"ellipsis"}
          overflow={"hidden"}
          variant="inherit"
        >
          Add Produto Base
        </Typography>
      </Button>
    </>
  );
};

export const ProdutosOrcamento = () => {
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
      ProdutosService.getAll({ page: pagina, filter: busca }, Number(id)).then((result) => {
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

  const pdfRef = useRef(null);

  return (
    <PaginaBase
      titulo={`Produto do Orçamento:  ${id}`}
      barraDeFerramentas={
        <FerramentasDaListagem
          mostrarInputBusca
          textoDaBusca={busca}
          onChangeBuscaTexto={(texto) =>
            setSearchParams({ busca: texto, pagina: "1" }, { replace: true })
          }
          mostrarBotaoNovo={false}
          mostrarBotaoVoltar
          componentePersonalizado={<>
            <IconButton onClick={() => {
              generatePDF(pdfRef, { filename: 'page.pdf' })
            }}><Icon>picture_as_pdf</Icon></IconButton>
            <BotoesOrcamento />
          </>
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
              <TableCell style={{ fontWeight: "bold" }}>Descrição</TableCell>
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
                <Actions
                  id={row.id}
                  showListButton
                  handleDelete={handleDelete}
                  handleShowList={() => {
                    navigate(`${location.pathname}/${row.id}/insumos`);
                  }}
                  toolTipListButton="Listar Insumos"
                />
                <TableCell>
                  <Typography>{row.titulo}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{row.observacoes}</Typography>
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
      <PDF id={Number(id)} referencia={pdfRef} />
    </PaginaBase>
  );
};
