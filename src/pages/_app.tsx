/* eslint-disable no-unused-vars */
import { type Mode } from "@anatoliygatt/dark-mode-toggle";
import { useQuery } from "@tanstack/react-query";
import { type AppType } from "next/app";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeSwitch } from "~/components/ThemeSwitch";
import { env } from "~/env.mjs";
import "~/styles/globals.css";
import { api } from "~/utils/api";

export enum TailwindMode {
  dark = "dark",
  light = "light",
}

const MyApp: AppType = ({ Component, pageProps }) => {
  const [mode, setMode] = useState<Mode>("dark");

  useQuery(["warmup"], async () => {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/warmup`, {
      method: "GET",
    });
    if (res.status !== 200) {
      toast.error("Error warming up the server");
    }
  });

  return (
    <div className={`${TailwindMode[mode]} relative flex h-screen w-[100%] `}>
      <ToastContainer
        autoClose={1500}
        pauseOnHover={false}
        pauseOnFocusLoss={false}
      />
      <div className="h-full w-full dark:bg-zinc-900">
        <ThemeSwitch setMode={setMode} mode={mode} />
        <Component {...pageProps} mode={mode} />
      </div>
    </div>
  );
};

export default api.withTRPC(MyApp);
