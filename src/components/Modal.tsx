/* eslint-disable react-hooks/exhaustive-deps */
import { type Mode } from "@anatoliygatt/dark-mode-toggle";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useCallback } from "react";
import { PacmanLoader } from "react-spinners";
import { useHome } from "~/hooks/useHome";
import { TailwindMode } from "~/pages/_app";
import { Countdown } from "./Countdown";

interface ModalProps {
  isOpen: boolean;
  type: "join" | "redirect" | undefined;
  closeModal: () => void;
  mode: Mode;
}

export const Modal = ({ isOpen, type, closeModal, mode }: ModalProps) => {
  const { hasUser } = useHome();

  const getContent = useCallback(() => {
    if (!hasUser) return <Modal.CreateUser />;
    if (type === "join") return <Modal.JoinSession />;
    if (type === "redirect") return <Modal.NewSession />;
  }, [hasUser, type]);

  if (!type) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`${TailwindMode[mode]} w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all `}
              >
                {getContent()}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

Modal.NewSession = function NewSessionContent() {
  const { handleRedirectToSession, sessionId, handleStartSession } = useHome();
  return (
    <div className="mr-[6px]">
      <p>
        A URL para compartilhar a sessão foi copiada para o seu clipboard, você
        será redirecionado para a sessão em....
      </p>
      <Countdown
        handleRedirectToSession={handleRedirectToSession}
        sessionId={sessionId}
        handleStartSession={handleStartSession}
      />
    </div>
  );
};

Modal.CreateUser = function CreateUserContent() {
  const { username, isLoading, setUsername, handleCreateUserAndStartSession } =
    useHome();
  return (
    <div className="mr-[6px]">
      <h1>Insira um nome de usuário:</h1>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Ex: Joaozin pedrin"
        className="mt-2 w-full rounded-md border-[1px] border-gray-400 p-2 pl-4 text-black outline-none"
      />
      <button
        onClick={handleCreateUserAndStartSession}
        className="mt-4 h-12 w-full bg-[#a2884f] text-white dark:bg-emerald-600"
      >
        Confirmar
      </button>
      {isLoading && (
        <div className="mt-8 flex justify-center">
          <PacmanLoader
            loading={true}
            color="#059669"
            size={20}
            aria-label="Loading Spinner"
          />
        </div>
      )}
    </div>
  );
};

Modal.JoinSession = function JoinSessionContent() {
  const { handleRedirectToSession, sessionId, setSessionId } = useHome();
  return (
    <div className="mr-[6px]">
      <h1>Entre abaixo com o ID da sessão:</h1>
      <input
        value={sessionId}
        onChange={(e) => setSessionId(e.target.value)}
        type="text"
        placeholder="Ex: d1864bad-73fc-43b9-9ef6-fce142012fba"
        className="mt-2 w-full rounded-md border-[1px] border-gray-400 p-2 pl-4 text-black outline-none"
      />
      <button
        onClick={handleRedirectToSession}
        className="mt-4 h-12 w-full bg-[#a2884f] text-white dark:bg-emerald-600"
      >
        Entrar na sessão
      </button>
    </div>
  );
};
