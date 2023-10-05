import { createContext, useCallback, useContext, useState } from "react";

interface IDrawerOption {
  icon: string;
  label: string;
  path: string;
}
interface IDrawerContext {
  isDrawerOpen: boolean;
  toggleDrawerOpen: () => void;
  drawerOptions: IDrawerOption[];
  setDrawerOptions: (newDrawerOptions: IDrawerOption[]) => void;
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
  const [drawerOptions, setDrawerOptions] = useState<IDrawerOption[]>([]);

  const toggleDrawerOpen = useCallback(() => {
    setIsDraweropen((isDrawerOpen) => !isDrawerOpen);
  }, []);

  const handleSetDrawerOptions = useCallback(
    (newDrawerOptions: IDrawerOption[]) => {
      setDrawerOptions(newDrawerOptions);
    },
    []
  );

  return (
    <DrawerContext.Provider
      value={{
        isDrawerOpen,
        drawerOptions,
        toggleDrawerOpen,
        setDrawerOptions: handleSetDrawerOptions,
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
};
