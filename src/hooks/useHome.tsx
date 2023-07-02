import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { parseCookies, setCookie } from "nookies";
import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { api } from "~/utils/api";

export type ModalState = {
  isOpen: boolean;
  type: "join" | "redirect" | undefined;
};

export const useHome = () => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    type: "join",
  });

  const [isJoinSessionModalOpen, setIsJoinSessionModalOpen] = useState(false);
  const [isRedirectModalOpen, setIsRedirectModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [sessionId, setSessionId] = useState("");

  const createSessionMutation = api.session.createSession.useMutation();
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

  const handleStartSession = async () => {
    await createSessionMutation
      .mutateAsync()
      .then(async (res) => {
        if (res) {
          setIsLoading(false);
          const url = `${window.location.origin}/session/${res.id}?userId=${user?.id}&username=${user?.name}`;
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

  const handleCreateUserAndStartSession = async () => {
    setIsLoading(true);
    const user = {
      name: username,
      id: uuidv4(),
    };
    refetch();
    setCookie(null, "user", JSON.stringify(user));
    await handleStartSession();
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
