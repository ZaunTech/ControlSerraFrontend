import {
  Box,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Icon,
  Avatar,
} from "@mui/material";
import { useAppDrawerContext } from "../../data/contexts";
import React from "react";


export interface IPaginaBase {
  children: React.ReactNode;
  titulo: string;
  barraDeFerramentas?: React.ReactNode;
}

export const PaginaBase: React.FC<IPaginaBase> = ({
  children,
  titulo,
  barraDeFerramentas,
}) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down("sm"));
  const menuSize = theme.spacing(28);
  const { toggleDrawerOpen } = useAppDrawerContext();

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      marginLeft={smDown ? 0 : menuSize}
    >
      <Box>
        <AppBar position="static">
          <Toolbar sx={{ width: "100%", height: theme.spacing(12) }}>
            <Box
              display={"flex"}
              flexDirection={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
              sx={{ width: "100%" }}
              padding={1}
            >
              <Box
                display={"flex"}
                flexDirection={"row"}
                alignItems={"center"}
                justifyContent={"center"}
                gap={theme.spacing(2)}
              >
                {smDown && (
                  <IconButton onClick={toggleDrawerOpen}>
                    <Icon>menu</Icon>
                  </IconButton>
                )}

                <Typography
                  variant="h6"
                  whiteSpace={"nowrap"}
                  textOverflow={"ellipsis"}
                  overflow={"hidden"}
                >
                  {titulo}
                </Typography>
              </Box>
              <Box
                display={"flex"}
                flexDirection={"row"}
                alignItems={"center"}
                justifyContent={"center"}
                gap={theme.spacing(2)}
              >
                
                <Box display={'flex'} flexDirection={"row"}>
              <Icon> personIcon
              </Icon>
                  <Typography>Nivaldo - Administrador</Typography>
                </Box>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      {barraDeFerramentas ? barraDeFerramentas : undefined}
      <Box flex={1} overflow={"auto"}>
        {children}
      </Box>
    </Box>
  );
};
