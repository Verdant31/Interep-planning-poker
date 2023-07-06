/* eslint-disable react-hooks/exhaustive-deps */
import { type Mode } from "@anatoliygatt/dark-mode-toggle";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { TailwindMode } from "~/pages/_app";

interface SessionNewUserModalProps {
  isOpen: boolean;
  mode: Mode;
  newUserName: string;
  setNewUserName: (value: string) => void;
  handleCreateUserAndStartSession: () => void;
}

export const SessionNewUserModal = ({
  isOpen,
  mode,
  handleCreateUserAndStartSession,
  newUserName,
  setNewUserName,
}: SessionNewUserModalProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => {}}>
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
                <div className="mr-[6px]">
                  <h1>Insira um nome de usuário:</h1>
                  <input
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    type="text"
                    placeholder="Ex: João É Senior"
                    className="mt-2 w-full rounded-md border-[1px] border-gray-400 p-2 pl-4 text-black outline-none"
                  />
                  <button
                    className="mt-4 h-12 w-full bg-[#a2884f] text-white dark:bg-emerald-600"
                    onClick={handleCreateUserAndStartSession}
                  >
                    Confirmar
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
