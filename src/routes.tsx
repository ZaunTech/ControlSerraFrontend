import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import { Cliente, Clientes, CriarCliente } from "./pages/clientes/index.tsx";
import { Insumo, Insumos, CriarInsumo } from "./pages/insumos/index.tsx";
import {
  ProdutosOrcamento,
  Orcamentos,
  CriarOrcamento,
  AddProdutoBase,
  CriarProduto,
  InsumosDeUmProdutoOrcamento,
  EditarOrcamento,
  CriarItemInsumoProdutoBase,
  ItemListaInsumoProduto,
  CotacoesDeUmInsumo,
  NovaCotacaoOrcamento,
  ProdutoOrcamento,
} from "./pages/orcamentos";
import {
  Pedido,
  Pedidos,
  CriarPedido,
  ProdutosPedido,
  InsumosProduto,
} from "./pages/pedidos";
import { Categoria, Categorias, CriarCategoria } from "./pages/categorias";
import {
  Fornecedor,
  Fornecedores,
  CriarFornecedor,
} from "./pages/fornecedores";
import {
  ProdutosBase,
  InsumoProdutoBase,
  CriarProdutoBase,
  AdicionarInsumo,
  ProdutoBase,
  ListaDeInsumosProdutoBase,
} from "./pages/produtosBase/index.tsx";
import { Home } from "./pages/home/Home.tsx";
import Error from "./pages/error/Error.tsx";
import { Login, RecuperarSenha } from "./pages/login";
import { Cotacoes, Cotacao, CriarCotacao, Recotar } from "./pages/cotacoes";
import {
  AlterarSenha,
  CriarUsuario,
  Usuario,
  Usuarios,
} from "./pages/usuarios/index.tsx";
import { Variantes } from "./pages/variantes/Variantes.tsx";
import { Variante } from "./pages/variantes/Variante.tsx";
import { CriarVariante } from "./pages/variantes/CriarVariante.tsx";

const router = createBrowserRouter([
  {
    path: "/login",
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "RecuperarSenha",
        element: <RecuperarSenha />,
      },
    ],
  },
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "Clientes",
        children: [
          {
            index: true,
            element: <Clientes />,
          },
          {
            path: "Novo",
            element: <CriarCliente />,
          },
          {
            path: ":id",
            element: <Cliente />,
          },
        ],
      },
      {
        path: "Fornecedores",
        children: [
          {
            index: true,
            element: <Fornecedores />,
          },
          {
            path: "Novo",
            element: <CriarFornecedor />,
          },
          {
            path: ":id",
            element: <Fornecedor />,
          },
        ],
      },
      {
        path: "Orcamentos",
        children: [
          {
            index: true,
            element: <Orcamentos />,
          },
          {
            path: "Novo",
            element: <CriarOrcamento />,
          },
          {
            path: ":id",
            children: [
              {
                index: true,
                element: <EditarOrcamento />,
              },
              { path: "AddProdutoBase", element: <AddProdutoBase /> },
              { path: "CriarProduto", element: <CriarProduto /> },
              {
                path: "produtos",
                children: [
                  {
                    index: true,
                    element: <ProdutosOrcamento />,
                  },
                  {
                    path: "CriarProduto",
                    element: <CriarProduto />,
                  },
                  {
                    path: "AddProdutoBase",
                    element: <AddProdutoBase />,
                  },
                  {
                    path: ":id",
                    children: [
                      {
                        index: true,
                        element: <ProdutoOrcamento />,
                      },
                      {
                        path: "insumos",
                        children: [
                          {
                            index: true,
                            element: <InsumosDeUmProdutoOrcamento />,
                          },
                          {
                            path: "Novo",
                            element: <CriarItemInsumoProdutoBase />,
                          },
                          {
                            path: ":idItemListaInsumos",
                            children: [
                              {
                                index: true,
                                element: <ItemListaInsumoProduto />,
                              },
                              {
                                path: "cotar",
                                children: [
                                  {
                                    index: true,
                                    element: <CotacoesDeUmInsumo />,
                                  },
                                  {
                                    path: "novo",
                                    element: <NovaCotacaoOrcamento />,
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "Pedidos",
        children: [
          {
            index: true,
            element: <Pedidos />,
          },
          {
            path: "Novo",
            element: <CriarPedido />,
          },
          {
            path: ":id",
            children: [
              {
                index: true,
                element: <Pedido />,
              },
              {
                path: "Produtos",
                children: [
                  {
                    index: true,
                    element: <ProdutosPedido />,
                  },
                  {
                    path: ":idProduto",
                    element: <InsumosProduto />,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "Insumos",
        children: [
          {
            index: true,
            element: <Insumos />,
          },
          {
            path: "Novo",
            element: <CriarInsumo />,
          },
          {
            path: ":id",
            children: [
              {
                index: true,
                element: <Insumo />,
              },
              {
                path: "variantes",
                children: [
                  {
                    index: true,
                    element: <Variantes />,
                  },
                  {
                    path: "novo",
                    element: <CriarVariante />,
                  },
                  {
                    path: ":idVariante",
                    element: <Variante />,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "Cotacoes",
        children: [
          {
            index: true,
            element: <Cotacoes />,
          },
          {
            path: "Novo",
            element: <CriarCotacao />,
          },
          {
            path: ":id",
            children: [
              {
                index: true,
                element: <Cotacao />,
              },
              {
                path: "recotar",
                element: <Recotar />,
              },
            ],
          },
        ],
      },
      {
        path: "Categorias",
        children: [
          {
            index: true,
            element: <Categorias />,
          },
          {
            path: "Novo",
            element: <CriarCategoria />,
          },
          {
            path: ":id",
            element: <Categoria />,
          },
        ],
      },
      {
        path: "Produtos",
        children: [
          {
            index: true,
            element: <ProdutosBase />,
          },
          {
            path: "Novo",
            element: <CriarProdutoBase />,
          },
          {
            path: ":id",
            children: [
              {
                index: true,
                element: <ProdutoBase />,
              },
              {
                path: "listaInsumos",
                children: [
                  {
                    index: true,
                    element: <ListaDeInsumosProdutoBase />,
                  },
                  {
                    path: "Novo",
                    element: <AdicionarInsumo />,
                  },
                  {
                    path: ":id",
                    element: <InsumoProdutoBase />,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "Usuarios",
        children: [
          {
            index: true,
            element: <Usuarios />,
          },
          {
            path: "Novo",
            element: <CriarUsuario />,
          },
          {
            path: ":id",
            children: [
              {
                index: true,
                element: <Usuario />,
              },
              {
                path: "alterarsenha",
                element: <AlterarSenha />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

function Routes() {
  return <RouterProvider router={router} />;
}

export default Routes;
