import React from "react";
import { Button } from "@mui/material";
import { useAppThemeContext } from "../../data/contexts/ThemeContext";

function Home() {
  const { toggleTheme } = useAppThemeContext();

  return (
    <div>
      Home
      <Button variant="contained" color="primary" onClick={toggleTheme}>
        Mudar Thema
      </Button>
    </div>
  );
}

export default Home;
