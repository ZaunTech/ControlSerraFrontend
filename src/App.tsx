import { Outlet, useNavigate } from "react-router-dom";
import { useTheme, useMediaQuery } from "@mui/material";
import { SideMenu } from "./ui/components";
import {
  AppDrawerProvider,
  IDrawerOption,
  useAuthContext,
} from "./data/contexts";
import { useEffect } from "react";

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
    { icon: "inventory", label: "Produtos Base", path: "/produtos" },
    { icon: "attach_money", label: "Cotações", path: "/cotacoes" },
    { icon: "local_offer", label: "Categorias", path: "/categorias" },
    { icon: "store", label: "Fornecedores", path: "/fornecedores" },
    { icon: "settings", label: "Usuarios", path: "/usuarios" },
  ];

  return <AppInner menuSize={menuSize} DrawerOptions={DrawerOptions} />;
};

interface AppInnerProps {
  menuSize: string;
  DrawerOptions: IDrawerOption[];
}

const AppInner = ({ menuSize, DrawerOptions }: AppInnerProps) => {
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        navigate("/login");
      }
    }, 5);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  const renderContent = () => {
    if (isAuthenticated) {
      return (
        <>
          <SideMenu sideWidth={menuSize} />
          <Outlet />
        </>
      );
    }
    return "Nao ta logado";
  };

  return (
    <AppDrawerProvider DrawerOptions={DrawerOptions}>
      {renderContent()}
    </AppDrawerProvider>
  );
};

export default App;
