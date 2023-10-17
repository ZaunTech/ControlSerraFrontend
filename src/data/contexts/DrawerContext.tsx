import { createContext, useCallback, useContext, useEffect, useState } from "react";

export interface IDrawerOption {
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

interface IDrawerProvider {
  children: React.ReactNode;
  DrawerOptions?: IDrawerOption[];
};

export const AppDrawerProvider: React.FC<IDrawerProvider> = ({ children, DrawerOptions }) => {
  const [isDrawerOpen, setIsDraweropen] = useState(false);
  const [drawerOptions, setDrawerOptions] = useState<IDrawerOption[]>([]);

  useEffect(() => { if (DrawerOptions !== undefined) setDrawerOptions(DrawerOptions) }, [DrawerOptions])

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
