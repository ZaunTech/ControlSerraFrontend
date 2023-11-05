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
} from "./pages/orcamentos";
import { Pedido, Pedidos, CriarPedido } from "./pages/pedidos";
import { Categoria, Categorias, CriarCategoria } from "./pages/categorias";
import {
  Fornecedor,
  Fornecedores,
  CriarFornecedor,
} from "./pages/fornecedores";
import {
  ProdutosBase,
  ProdutoBase,
  CriarProdutoBase,
  AdicionarInsumo,
  ItemListaInsumoProdutoBase,
} from "./pages/produtosBase/index.tsx";
import { Home } from "./pages/home/Home.tsx";
import Error from "./pages/error/Error.tsx";
import { Login, RecuperarSenha } from "./pages/login";
import { Cotacoes, Cotacao, CriarCotacao } from "./pages/cotacoes";
import { EditarProduto } from "./pages/orcamentos/EditarProduto.tsx";
import { EditarProdutoBase } from "./pages/produtosBase/EditarProdutoBase.tsx";
import { CriarUsuario, Usuario, Usuarios } from "./pages/Usuarios";

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
                        element: <EditarProduto />,
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
                                path: 'cotar',
                                element: <CotacoesDeUmInsumo />
                              },
                            ]
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
            element: <Pedido />,
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
            element: <Insumo />,
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
            element: <Cotacao />,
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
                element: <EditarProdutoBase />,
              },
              {
                path: "listaInsumos",
                element: <ProdutoBase />,
              },
              {
                path: ":id",
                element: <ItemListaInsumoProdutoBase />,
              },
              {
                path: "Novo",
                element: <AdicionarInsumo />,
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
            element: <Usuario />,
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
