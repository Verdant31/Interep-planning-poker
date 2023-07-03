import { DarkModeToggle, type Mode } from "@anatoliygatt/dark-mode-toggle";
import { type Dispatch, type SetStateAction } from "react";

interface ThemeSwitchProps {
  setMode: Dispatch<SetStateAction<Mode>>;
  mode: Mode;
}

export const ThemeSwitch = ({ mode, setMode }: ThemeSwitchProps) => {
  return (
    <div className="absolute right-6 top-6 z-50">
      <DarkModeToggle
        mode={mode}
        dark="Dark"
        light="Light"
        size="sm"
        onChange={(mode) => {
          setMode(mode);
        }}
      />
    </div>
  );
};
