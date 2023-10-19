import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";

import {
  Cliente,
  Clientes,
  EditarCliente,
  CriarCliente,
  ExcluirCliente,
} from "./pages/clientes/index.tsx";

import {
  Insumo,
  Insumos,
  EditarInsumo,
  CriarInsumo,
  ExcluirInsumo,
} from "./pages/insumos/index.tsx";

import {
  Orcamento,
  Orcamentos,
  EditarOrcamento,
  CriarOrcamento,
  ExcluirOrcamento,
} from "./pages/orcamentos/index.tsx";

import {
  Pedido,
  Pedidos,
  EditarPedido,
  CriarPedido,
  ExcluirPedido,
} from "./pages/pedidos/index.tsx";

import {
  Categoria,
  Categorias,
  EditarCategoria,
  CriarCategoria,
  ExcluirCategoria,
} from "./pages/categorias/index.tsx";

import {
  Fornecedor,
  Fornecedores,
  EditarFornecedor,
  CriarFornecedor,
  ExcluirFornecedor,
} from "./pages/fornecedores/index.tsx";
import {
  Produto,
  Produtos,
  EditarProduto,
  CriarProduto,
  ExcluirProduto,
} from "./pages/produtos/index.tsx";

import Configuracoes from "./pages/Configuracoes/Configuracoes.tsx";
import Home from "./pages/home/Home.tsx";
import Error from "./pages/error/Error.tsx";
import { Login, RecuperarSenha } from "./pages/login/index.ts";

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
            children: [
              {
                index: true,
                element: <Cliente />,
              },
              {
                path: "editar",
                element: <EditarCliente />,
              },
              {
                path: "excluir",
                element: <ExcluirCliente />,
              },
            ],
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
            children: [
              {
                index: true,
                element: <Fornecedor />,
              },
              {
                path: "editar",
                element: <EditarFornecedor />,
              },
              {
                path: "excluir",
                element: <ExcluirFornecedor />,
              },
            ],
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
                element: <Orcamento />,
              },
              {
                path: "editar",
                element: <EditarOrcamento />,
              },
              {
                path: "excluir",
                element: <ExcluirOrcamento />,
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
                path: "editar",
                element: <EditarPedido />,
              },
              {
                path: "excluir",
                element: <ExcluirPedido />,
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
                path: "editar",
                element: <EditarInsumo />,
              },
              {
                path: "excluir",
                element: <ExcluirInsumo />,
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
            children: [
              {
                index: true,
                element: <Categoria />,
              },
              {
                path: "editar",
                element: <EditarCategoria />,
              },
              {
                path: "excluir",
                element: <ExcluirCategoria />,
              },
            ],
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
            children: [
              {
                index: true,
                element: <Produto />,
              },
              {
                path: "editar",
                element: <EditarProduto />,
              },
              {
                path: "excluir",
                element: <EditarProduto />,
              },
            ],
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
