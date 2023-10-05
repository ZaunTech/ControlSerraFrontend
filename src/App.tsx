import { Outlet } from "react-router-dom";
import SideMenu from "./ui/components/navigation/SideMenu";
import { Box, useTheme, useMediaQuery } from "@mui/material";

function App() {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down("sm"));
  const menuSize = theme.spacing(28);
  return (
    <>
      <SideMenu sideWidth={menuSize} />
      <Outlet />
      <h2>Footer</h2>
    </>
  );
}

export default App;
