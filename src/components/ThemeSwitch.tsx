import { DarkModeToggle, type Mode } from "@anatoliygatt/dark-mode-toggle";
import { useRouter } from "next/router";
import { type Dispatch, type SetStateAction } from "react";

interface ThemeSwitchProps {
  setMode: Dispatch<SetStateAction<Mode>>;
  mode: Mode;
}

export const ThemeSwitch = ({ mode, setMode }: ThemeSwitchProps) => {
  const router = useRouter();
  return (
    <div className="absolute right-8 top-8 z-50 flex items-center">
      {router.pathname !== "/" && (
        <button
          className="mr-8 text-xl tracking-wider text-[#a2884f] underline dark:text-emerald-500"
          onClick={() => router.push("/")}
        >
          Home
        </button>
      )}
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
