import { type Mode } from "@anatoliygatt/dark-mode-toggle";
import { type AppType } from "next/app";
import { useState } from "react";
import { ThemeSwitch } from "~/components/ThemeSwitch";
import "~/styles/globals.css";
import { api } from "~/utils/api";

export enum TailwindMode {
  dark = "dark",
  light = "light",
}

const MyApp: AppType = ({ Component, pageProps }) => {
  const [mode, setMode] = useState<Mode>("dark");

  return (
    <div className={`${TailwindMode[mode]} relative flex h-screen w-[100%] `}>
      <div className="h-full w-full dark:bg-zinc-900">
        <ThemeSwitch setMode={setMode} mode={mode} />
        <Component {...pageProps} mode={mode} />
      </div>
    </div>
  );
};

export default api.withTRPC(MyApp);
