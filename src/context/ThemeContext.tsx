import { type Mode } from "@anatoliygatt/dark-mode-toggle";
import {
  ReactNode,
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

interface ThemeContextProps {
  mode: Mode;
  setMode: Dispatch<SetStateAction<Mode>>;
}

const ThemeContext = createContext({} as ThemeContextProps);

interface ThemeContextProviderProps {
  children: ReactNode;
}

export const ThemeContextProvider = ({
  children,
}: ThemeContextProviderProps) => {
  const [mode, setMode] = useState<Mode>("dark");

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const value = useContext(ThemeContext);
  return value;
};
