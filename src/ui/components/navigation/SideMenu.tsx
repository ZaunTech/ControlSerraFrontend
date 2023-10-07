import {
  Drawer,
  List,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  Typography,
  Box,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useMatch, useNavigate, useResolvedPath } from "react-router-dom";
import {
  useAppDrawerContext,
  useAppThemeContext,
} from "../../../data/contexts";
import Icon from "@mui/material/Icon";

interface IListItemLinkProps {
  label?: string;
  icon?: string;
  to: string;
  onClick?: (() => void) | undefined;
}

const ListItemLink: React.FC<IListItemLinkProps> = ({
  to,
  icon,
  label,
  onClick,
}) => {
  const navigate = useNavigate();
  const resolvedPath = useResolvedPath(to);
  const match = useMatch({ path: resolvedPath.pathname, end: true });

  const handleClick = () => {
    navigate(to);
    onClick?.();
  };

  return (
    <ListItemButton selected={!!match} onClick={handleClick}>
      <ListItemIcon>
        <Icon>{icon}</Icon>
      </ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  );
};

interface SideMenuProps {
  sideWidth: string;
}

export function SideMenu({ sideWidth }: SideMenuProps) {
  const { themeName, toggleTheme } = useAppThemeContext();
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down("sm"));
  const { isDrawerOpen, toggleDrawerOpen, drawerOptions } =
    useAppDrawerContext();
  return (
    <Drawer
      open={isDrawerOpen}
      variant={smDown ? "temporary" : "permanent"}
      anchor="left"
      sx={{ width: "100%" }}
      onClose={toggleDrawerOpen}
    >
      <Box
        width={sideWidth}
        height={"100%"}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"space-around"}
        alignItems={"center"}
      >
        <Box
          display={"flex"}
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={"center"}
          width={"100%"}
          height={theme.spacing(20)}
          gap={theme.spacing(1)}
        >
          <Icon>handyman</Icon>
          <Typography variant="h5">Control Serra</Typography>
        </Box>

        <Divider sx={{ width: "100%" }} />

        <List component={"nav"} sx={{ flexGrow: 1 }}>
          {drawerOptions.map((drawerOption) => (
            <ListItemLink
              key={drawerOption.path}
              icon={drawerOption.icon}
              label={drawerOption.label}
              to={drawerOption.path}
              onClick={smDown ? toggleDrawerOpen : undefined}
            />
          ))}
          <ListItemButton onClick={toggleTheme}>
            <ListItemIcon>
              <Icon>{themeName === "light" ? "dark_mode" : "light_mode"}</Icon>
            </ListItemIcon>
            <ListItemText primary={"Trocar Tema"} />
          </ListItemButton>
          <ListItemButton onClick={() => {}}>
            <ListItemIcon>
              <Icon>logout</Icon>
            </ListItemIcon>
            <ListItemText primary={"Logout"} />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
}
