import Image from "next/image";

import { ClipLoader } from "react-spinners";
import { Modal } from "~/components/Modal";
import { useHome } from "~/hooks/useHome";

export default function Home() {
  const { isLoading, modalState, setModalState } = useHome();

  return (
    <main className="mx-auto mt-32 flex w-96 flex-col items-center gap-12">
      <Image
        src="/interep.png"
        width={300}
        height={300}
        alt="Logo da interep"
      />
      <div className="mb-8 flex flex-col items-center gap-6">
        <button
          className="btn-home"
          onClick={() => setModalState({ isOpen: true, type: "redirect" })}
        >
          Iniciar nova sessão
        </button>
        <button
          className="btn-home"
          onClick={() => setModalState({ isOpen: true, type: "join" })}
        >
          Entrar em sessão existente
        </button>
      </div>
      <Modal
        closeModal={() => setModalState({ isOpen: false, type: undefined })}
        isOpen={modalState.isOpen}
        type={modalState.type}
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
