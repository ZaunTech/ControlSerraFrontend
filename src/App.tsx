import { Outlet } from "react-router-dom";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { SideMenu } from "./ui/components";
import { useAppDrawerContext } from "./data/contexts";
import { useEffect } from "react";

function App() {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down("sm"));
  const menuSize = theme.spacing(28);
  const { setDrawerOptions } = useAppDrawerContext();

  useEffect(() => {
    setDrawerOptions([
      { icon: "home", label: "Home", path: "/" },
      { icon: "person", label: "Clientes", path: "/clientes" },
      { icon: "description", label: "Orçamentos", path: "/orcamentos" },
      { icon: "shoppingcart", label: "Pedidos", path: "/pedidos" },
      { icon: "construction", label: "Insumos", path: "/insumos" },
      { icon: "store", label: "Fornecedores", path: "/fornecedores" },
      { icon: "settings", label: "Configurações", path: "/configuracoes" },
    ]);
  }, []);

  return (
    <>
      <SideMenu sideWidth={menuSize} />
      <Outlet />
      <h2>Footer</h2>
    </>
  );
}

export default App;
