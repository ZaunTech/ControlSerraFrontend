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
import { FornecedoresService, ICliente, IFornecedor, PedidosService } from "../../data/services/api";
import { IOrcamento, OrcamentosService } from "../../data/services/api/modules/orcamentos";
import { format, parseISO } from "date-fns";

interface IPDF {
  id: number,
  referencia: Ref<HTMLDivElement | null>
}

const PDF = forwardRef(({ id, referencia }: IPDF) => {
  const [fornecedor, setFornecedor] = useState<IFornecedor>();
  const [cliente, setCliente] = useState<ICliente>();
  const [produtos, setProdutos] = useState<IProduto[]>();
  const [orcamento, setOrcamento] = useState<IOrcamento>();
  useEffect(() => {
    OrcamentosService.getFullById(id).then((result) => {
      if (result instanceof Error) {
        return
      }
      setCliente(result.cliente);
      setProdutos(result.produtos);
      setOrcamento(result)
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
        width: "1000px",
        height: "1000px"
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
            <Card sx={{ minWidth: 400, border:1 }}>
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
          {cliente && (<Card sx={{ minWidth: 400 , border:1 }}>
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
          
        </Box>
        <Box sx={{ border: 1 }} display={'flex'} flexDirection={'column'} padding={'10px'} gap={'10px'} marginTop={'10px'}> 
        <Typography variant="h5">
            {`Orçamento`}
          </Typography>
        <Table  aria-label="simple table" >
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
          <TableBody   >
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
          
        
       <Box flexDirection={"column"} display={"flex"}>
       {orcamento && (<>
        <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} width={"900px"}>
        <Typography></Typography>
        <Typography>Valor Materias: { orcamento.totalMateriais}</Typography>
        </Box>
        <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} width={"900px"}>
        <Typography></Typography>
        <Typography>Valor Mão de Obra: {orcamento.totalMaoObra }</Typography>
        </Box>
        <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} width={"900px"}>
        <Typography></Typography>
        <Typography>Valor Total: {orcamento.totalMaoObra + orcamento.totalMateriais}</Typography>
        </Box>
        </>
       )}
       </Box>
       </Box>
       <Box>
       {orcamento && (
        <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} width={"900px"}>
        <Typography>Este orçamento é valido até:  {format(parseISO(String(orcamento.validade)), "dd/MM/yyyy")}</Typography>
        <Typography>Prazo estimado de Produção: {orcamento.prazoEstimadoProducao} Dias</Typography>
        </Box>
       )}
       </Box>
      </TableContainer>
    </div >
  )
}
)



export const ProdutosPedido = () => {
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

  
  async function getID() {
    try {
      const result = await PedidosService.getById(Number(id));
      return result.idOrcamento;
    } catch (error) {
      console.error("Erro ao obter o pedido:", error);
      throw error; // Se quiser propagar o erro para quem chamou a função
    }
  }

  useEffect(() => {
    setIsLoading(true);
    debounce(async () => {
      try {
        const idOrcamento = await getID();
        const result = await ProdutosService.getAll({ page: pagina, filter: busca },idOrcamento);
        if (result instanceof Error) {
          alert(result.message);
          return;
        }
        setRows(result.data);
        setTotalCount(result.totalCount);
      } catch (error) {
        console.error("Erro durante a execução do efeito:", error);
      } finally {
        setIsLoading(false);
      }
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
      titulo={`Produto do Pedido:  ${id}`}
      barraDeFerramentas={
        <FerramentasDaListagem
          mostrarInputBusca
          textoDaBusca={busca}
          onChangeBuscaTexto={(texto) =>
            setSearchParams({ busca: texto, pagina: "1" }, { replace: true })
          }
          mostrarBotaoNovo={false}
          mostrarBotaoVoltar
          componentePersonalizado={
            <>
              <Button
                startIcon={<Icon>picture_as_pdf</Icon>}
                onClick={() => {
                  generatePDF(pdfRef, { filename: "page.pdf" });
                }}
                variant="contained"
              >
                Gerar PDF
              </Button>
              
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
                    navigate(`${location.pathname}/${row.id}`);
                  }}
                  showEditButton={false}
                  showDeleteButton={false}
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
