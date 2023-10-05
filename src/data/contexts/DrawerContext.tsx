import { createContext, useCallback, useContext, useState } from "react";

interface IDrawerContext {
  isDrawerOpen: boolean;
  toggleDrawerOpen: () => void;
}

const DrawerContext = createContext({} as IDrawerContext);

export const useAppDrawerContext = () => {
  return useContext(DrawerContext);
};

type Props = {
  children?: React.ReactNode;
};

export const AppDrawerProvider: React.FC<Props> = ({ children }) => {
  const [isDrawerOpen, setIsDraweropen] = useState(false);

  const toggleDrawerOpen = useCallback(() => {
    setIsDraweropen((isDrawerOpen) => !isDrawerOpen);
  }, []);

  return (
    <DrawerContext.Provider value={{ isDrawerOpen, toggleDrawerOpen }}>
      {children}
    </DrawerContext.Provider>
  );
};
