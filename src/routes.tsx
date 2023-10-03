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

import Configuracoes from "./pages/Configuracoes/Configuracoes.tsx";
import Home from "./pages/home/Home.tsx";
import Login from "./pages/login/Login.tsx";
import Error from "./pages/error/Error.tsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
    errorElement: <Error />,
  },
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "Clientes",
        element: <Clientes />,
        children: [
          {
            path: "Novo",
            element: <CriarCliente />,
          },
          {
            path: ":id",
            element: <Cliente />,
            children: [
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
        element: <Fornecedores />,
        children: [
          {
            path: "Novo",
            element: <CriarFornecedor />,
          },
          {
            path: ":id",
            element: <Fornecedor />,
            children: [
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
        path: "Home",
        element: <Home />,
      },
      {
        path: "Orcamentos",
        element: <Orcamentos />,
        children: [
          {
            path: "Novo",
            element: <CriarOrcamento />,
          },
          {
            path: ":id",
            element: <Orcamento />,
            children: [
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
        element: <Pedidos />,
        children: [
          {
            path: "Novo",
            element: <CriarPedido />,
          },
          {
            path: ":id",
            element: <Pedido />,
            children: [
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
        element: <Insumos />,
        children: [
          {
            path: "Novo",
            element: <CriarInsumo />,
          },
          {
            path: ":id",
            element: <Insumo />,
            children: [
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
        element: <Categorias />,
        children: [
          {
            path: "Novo",
            element: <CriarCategoria />,
          },
          {
            path: ":id",
            element: <Categoria />,
            children: [
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
