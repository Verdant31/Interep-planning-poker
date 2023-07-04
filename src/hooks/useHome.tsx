import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { parseCookies, setCookie } from "nookies";
import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { User } from "~/pages/session/[sessionId]";

export type ModalState = {
  isOpen: boolean;
  type: "join" | "redirect" | undefined;
};

export interface StartSessionProps {
  createdUser?: User;
  copyUrl?: boolean;
}

export const useHome = () => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    type: "join",
  });

  const [isJoinSessionModalOpen, setIsJoinSessionModalOpen] = useState(false);
  const [isRedirectModalOpen, setIsRedirectModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("Joaozin");
  const [sessionId, setSessionId] = useState("");

  const router = useRouter();

  const { data: user, refetch } = useQuery(["user"], async () => {
    const cookies = parseCookies();
    const user = JSON.parse(cookies.user || "{}");
    return user as { name: string; id: string };
  });

  const handleRedirectToSession = useCallback(async () => {
    router.push(
      `/session/${sessionId}?userId=${user?.id}&username=${user?.name}`
    );
  }, [router, sessionId, user]);

  const handleStartSession = async ({
    copyUrl,
    createdUser,
  }: StartSessionProps) => {
    const finalUser = createdUser ?? user;
    const sessionId = uuidv4();
    if (copyUrl) {
      const url = `${window.location.origin}/session/${sessionId}?userId=${finalUser?.id}&username=${finalUser?.name}`;
      await navigator.clipboard.writeText(url);
    }
    setIsLoading(false);
    setSessionId(sessionId);
    setIsRedirectModalOpen(true);
  };

  const handleCreateUserAndStartSession = async (copyUrl?: boolean) => {
    setIsLoading(true);
    const user = {
      name: username,
      id: uuidv4(),
    };
    refetch();
    setCookie(null, "user", JSON.stringify(user));
    await handleStartSession({ copyUrl, createdUser: user });
  };

  useEffect(() => {
    refetch();
  }, [refetch, sessionId]);

  const hasUser = Object.keys(user ?? {}).length > 0;

  return {
    isJoinSessionModalOpen,
    setIsJoinSessionModalOpen,
    isRedirectModalOpen,
    setIsRedirectModalOpen,
    isLoading,
    username,
    setUsername,
    sessionId,
    user,
    handleStartSession,
    handleCreateUserAndStartSession,
    handleRedirectToSession,
    setSessionId,
    modalState,
    setModalState,
    hasUser,
  };
};
