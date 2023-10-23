import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";

import {
  Cliente,
  Clientes,
  CriarCliente,
} from "./pages/clientes/index.tsx";

import {
  Insumo,
  Insumos,
  CriarInsumo,
} from "./pages/insumos/index.tsx";

import {
  Orcamento,
  Orcamentos,
  CriarOrcamento,
} from "./pages/orcamentos";

import {
  Pedido,
  Pedidos,
  CriarPedido,
} from "./pages/pedidos";

import {
  Categoria,
  Categorias,
  CriarCategoria,
} from "./pages/categorias";

import {
  Fornecedor,
  Fornecedores,
  CriarFornecedor,
} from "./pages/fornecedores";

import {
  Produto,
  Produtos,
  CriarProduto,
} from "./pages/produtos";

import Configuracoes from "./pages/Configuracoes/Configuracoes.tsx";
import Home from "./pages/home/Home.tsx";
import Error from "./pages/error/Error.tsx";
import { Login, RecuperarSenha } from "./pages/login";
import {
  Cotacoes,
  Cotacao,
  CriarCotacao,
} from "./pages/cotacoes";

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
            element: <Orcamento />,
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
            element: <Produtos />,
          },
          {
            path: "Novo",
            element: <CriarProduto />,
          },
          {
            path: ":id",
            element: <Produto />,
          },
        ],
      },
      {
        path: "Configuracoes",
        element: <Configuracoes />,
      },
    ],
  },
]);

function Routes() {
  return <RouterProvider router={router} />;
}

export default Routes;
