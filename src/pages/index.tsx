import { useQuery } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { Modal } from "~/components/Modal";
import { env } from "~/env.mjs";
import { useHome } from "~/hooks/useHome";
import { DefaultInterface } from "~/types";

export default function Home({ mode }: DefaultInterface) {
  const { isLoading, modalState, setModalState } = useHome();

  useQuery(["warmup"], async () => {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/warmup`, {
      method: "GET",
    });
    if (res.status !== 200) {
      toast.error("Error warming up the server");
    }
  });

  return (
    <main className="mx-auto mt-20 flex w-96 flex-col items-center gap-12">
      <div>
        <h1 className="text-6xl font-semibold tracking-widest dark:text-emerald-600">
          Interep
        </h1>
        <h1 className="ml-16 mt-4 text-6xl font-semibold tracking-widest dark:text-emerald-600">
          Planning
        </h1>
      </div>
      <div className="mb-8 mt-8 flex w-80  flex-col items-center gap-6">
        <button
          className="btn-home font  h-14 text-lg dark:bg-emerald-600 dark:text-white"
          onClick={() => setModalState({ isOpen: true, type: "redirect" })}
        >
          Iniciar nova sessão
        </button>
        <button
          className="btn-home font  h-14 text-lg dark:bg-emerald-600 dark:text-white"
          onClick={() => setModalState({ isOpen: true, type: "join" })}
        >
          Entrar em sessão existente
        </button>
      </div>
      <Modal
        closeModal={() => setModalState({ isOpen: false, type: undefined })}
        isOpen={modalState.isOpen}
        type={modalState.type}
        mode={mode}
      />
      <ClipLoader
        loading={isLoading}
        color="#a2884f"
        size={90}
        aria-label="Loading Spinner"
      />
    </main>
  );
}
