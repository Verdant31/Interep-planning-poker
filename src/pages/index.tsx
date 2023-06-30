/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import Image from "next/image";

import { Dialog, Transition } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { setCookie } from "nookies";
import { Fragment, useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { getUser } from "~/queries/getUser";
import { api } from "~/utils/api";

interface MyModalProps {
  isOpen: boolean;
  closeModal: () => void;
  children: React.ReactNode;
}

function Modal({ isOpen, closeModal, children }: MyModalProps) {
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default function Home() {
  const router = useRouter();
  const [isJoinSessionModalOpen, setIsJoinSessionModalOpen] = useState(false);
  const [isRedirectModalOpen, setIsRedirectModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");

  const [sessionId, setSessionId] = useState("");

  const createSessionMutation = api.session.createSession.useMutation();
  const createUserMutation = api.user.createUser.useMutation();

  const { data: user, refetch } = useQuery(["user"], getUser);

  const handleStartSession = async () => {
    setIsLoading(true);
    const user = await createUserMutation.mutateAsync({ name: username });
    setCookie(undefined, "userId", user.id, {
      path: "/",
    });
    await refetch();
    await createSessionMutation
      .mutateAsync()
      .then(async (res) => {
        if (res) {
          setIsLoading(false);
          const url = `${window.location.origin}/session/${res.id}`;
          await navigator.clipboard.writeText(url);
          setSessionId(res.id);
          setIsRedirectModalOpen(true);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  };

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
          onClick={() => setIsRedirectModalOpen(true)}
        >
          Iniciar nova sessão
        </button>
        <button
          className="btn-home"
          onClick={() => setIsJoinSessionModalOpen(true)}
        >
          Entrar em sessão existente
        </button>
      </div>
      <ClipLoader
        loading={isLoading}
        color="#a2884f"
        size={90}
        aria-label="Loading Spinner"
      />
      <Modal
        isOpen={isRedirectModalOpen}
        closeModal={() => setIsRedirectModalOpen(false)}
      >
        <div className="mr-[6px]">
          {user ? (
            <>
              <p>
                A URL para compartilhar a sessão foi copiada para o seu
                clipboard, você sera{" "}
                <span
                  className="cursor-pointer underline"
                  onClick={() => router.push(`/session/${sessionId}`)}
                >
                  redirecionado
                </span>{" "}
                para a sessão em....
              </p>
              <Countdown />
            </>
          ) : (
            <div className="mr-[6px]">
              <h1>Insira um nome de usuário:</h1>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: d1864bad-73fc-43b9-9ef6-fce142012fba"
                className="mt-2 w-full rounded-md border-[1px] border-gray-400 p-2 pl-4 text-black outline-none"
              />
              <button
                onClick={handleStartSession}
                className="mt-4 h-12 w-full bg-[#a2884f] text-white dark:bg-zinc-900"
              >
                Confirmar
              </button>
            </div>
          )}
        </div>
      </Modal>
      <Modal
        isOpen={isJoinSessionModalOpen}
        closeModal={() => setIsJoinSessionModalOpen(false)}
      >
        <div className="mr-[6px]">
          <h1>Entre abaixo com o ID da sessão:</h1>
          <input
            type="text"
            placeholder="Ex: d1864bad-73fc-43b9-9ef6-fce142012fba"
            className="mt-2 w-full rounded-md border-[1px] border-gray-400 p-2 pl-4 text-black outline-none"
          />
          <button className="mt-4 h-12 w-full bg-[#a2884f] text-white dark:bg-zinc-900">
            Entrar na sessão
          </button>
        </div>
      </Modal>
    </main>
  );
}

function Countdown() {
  const [time, setTime] = useState(10);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTime(time - 1);
    }, 1000);

    if (time === 0) {
      clearTimeout(timer);
    }
  }, [time]);

  return <h1 className="mt-4 text-center text-xl">{time} segundos</h1>;
}
