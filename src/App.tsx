import { Outlet } from "react-router-dom";
import { useTheme, useMediaQuery } from "@mui/material";
import { SideMenu } from "./ui/components";
import { AppDrawerProvider, AuthProvider } from "./data/contexts";

const App = () => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down("sm"));
  const menuSize = theme.spacing(28);

  const DrawerOptions = [
    { icon: "home", label: "Home", path: "/" },
    { icon: "person", label: "Clientes", path: "/clientes" },
    { icon: "description", label: "Orçamentos", path: "/orcamentos" },
    { icon: "shoppingcart", label: "Pedidos", path: "/pedidos" },
    { icon: "construction", label: "Insumos", path: "/insumos" },
    { icon: "store", label: "Fornecedores", path: "/fornecedores" },
    { icon: "settings", label: "Configurações", path: "/configuracoes" },
  ];

  return (
    <AuthProvider>
      <AppDrawerProvider DrawerOptions={DrawerOptions}>
        <SideMenu sideWidth={menuSize} />
        <Outlet />
        <h2>Footer</h2>
      </AppDrawerProvider>
    </AuthProvider>
  );
}

export default App;
