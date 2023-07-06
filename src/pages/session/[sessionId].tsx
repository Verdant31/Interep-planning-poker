/* eslint-disable react-hooks/exhaustive-deps */
import { motion } from "framer-motion";
import { GetServerSideProps } from "next";
import { parseCookies, setCookie } from "nookies";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { SessionNewUserModal } from "~/components/SessionNewUserModal";
import { env } from "~/env.mjs";
import { DefaultInterface } from "~/types";
import { getPositionByIndex } from "~/utils/getPositionByIndex";

const fibonnaciSequence = [1, 2, 3, 5, 8, 13, 21, 34, 55];

const socket = io(env.NEXT_PUBLIC_API_URL);

export type User = {
  id: string;
  name: string;
  card?: number | null;
};

interface SessionProps extends DefaultInterface {
  sessionId: string;
  userId: string;
  username: string;
}

export default function Session({
  mode,
  sessionId,
  userId,
  username,
}: SessionProps) {
  const [revealCards, setRevealCards] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [newUserName, setNewUserName] = useState("");
  const [user, setUser] = useState<User | null>(
    userId ? { id: userId, name: username, card: null } : null
  );

  useEffect(() => {
    if (!sessionId || !user) return;
    socket.emit("joinSession", {
      sessionId,
      user: { id: user.id, name: user.name, card: null },
    });
    socket.on("joinedSession", ({ users, newUser }) => {
      if (!(newUser.id === user.id)) {
        toast.info(`${newUser.name} entrou na sala`);
      }
      setUsers(users);
    });
    socket.on("cardChosen", (users) => {
      setUsers(users);
    });
    socket.on("gameReset", (users) => {
      setUsers(users);
      setRevealCards(false);
    });
    socket.on("cardsReveal", () => {
      setRevealCards(true);
    });
    socket.on("userLeft", ({ users, leftUser }) => {
      toast.info(`${leftUser.name} saiu da sala`);
      setUsers(users);
    });
  }, [user]);

  useEffect(() => {
    window.addEventListener("unload", handleTabClosing);
    return () => {
      window.removeEventListener("unload", handleTabClosing);
    };
  }, []);

  const handleTabClosing = () => {
    socket.emit("userExited", {
      sessionId,
      user: { id: user?.id, name: username, card: null },
    });
  };

  const handleChooseCard = (card: number) => {
    socket.emit("chooseCard", { sessionId, userId: user?.id, card });
  };

  const handleResetGame = () => {
    socket.emit("resetGame", { sessionId });
  };

  const handleRevealCards = () => {
    socket.emit("revealCards", { sessionId });
  };

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(
      `${env.NEXT_PUBLIC_APP_URL}/session/${sessionId}`
    );
    toast.info("Link copiado para a área de transferência");
  };

  const handleCreateUserAndStartSession = async () => {
    if (!newUserName) return;
    setUser({ id: uuidv4(), name: newUserName, card: null });
    setCookie(null, "user", JSON.stringify(user));
  };

  const whoami = users.find((oldUser) => oldUser.id === user?.id);

  let voteCount = 0;

  const mean =
    users.reduce((acc, user) => {
      if (user.card) {
        return acc + user.card;
      }
      return acc;
    }, 0) / users?.map((user) => user.card).filter((card) => card).length;

  const closestValue = fibonnaciSequence.reduce((prev, curr) =>
    Math.abs(curr - mean) < Math.abs(prev - mean) ? curr : prev
  );

  const noUserHasVoted = users.every((user) => !user.card);

  return (
    <div className="relative flex h-screen w-full flex-col items-center">
      <SessionNewUserModal
        newUserName={newUserName}
        setNewUserName={setNewUserName}
        isOpen={!user?.id}
        mode={mode}
        handleCreateUserAndStartSession={handleCreateUserAndStartSession}
      />
      <button
        onClick={handleCopyUrl}
        className="absolute left-8 top-8 text-xl tracking-wider text-[#a2884f] underline dark:text-emerald-500"
      >
        Link da sessão
      </button>
      {revealCards && (
        <div>
          <motion.h1
            initial={{ scale: 0, x: -200 }}
            transition={{ duration: 0.5 }}
            animate={{ scale: 1, x: 0 }}
            className="mt-10 text-xl font-medium uppercase tracking-wider text-[#a2884f] dark:text-emerald-600"
          >
            Média(fibonnaci):
            <span className="ml-2 text-zinc-700 dark:text-white">
              {closestValue ?? 0}
            </span>
          </motion.h1>
          <motion.h1
            initial={{ scale: 0, x: -200 }}
            transition={{ duration: 0.5 }}
            animate={{ scale: 1, x: 0 }}
            className="text-xl font-medium uppercase tracking-wider text-[#a2884f] dark:text-emerald-600"
          >
            Média:
            <span className="ml-2 text-zinc-700 dark:text-white">
              {mean ?? 0}
            </span>
          </motion.h1>
        </div>
      )}
      <main
        style={{ marginTop: revealCards ? 250 : 310 }}
        className="relative mx-auto flex w-[600px] flex-col items-center gap-12"
      >
        <button
          disabled={noUserHasVoted}
          style={{ cursor: noUserHasVoted ? "not-allowed" : "pointer" }}
          onClick={() =>
            !revealCards ? handleRevealCards() : handleResetGame()
          }
          className=" absolute left-[50%] top-[50%] flex h-12 w-60 translate-x-[-50%] translate-y-[-50%] transform items-center justify-center rounded-lg bg-[#a2884f] text-white dark:bg-emerald-600"
        >
          <h1 className="text-md font-semibold uppercase tracking-wider ">
            {!revealCards ? "Revelar cartas" : "Nova rodada"}
          </h1>
        </button>
        {users.length > 0 &&
          users.map((user, index) => {
            if (user.card) voteCount += 1;
            return (
              <div
                className="absolute flex flex-col items-center"
                style={getPositionByIndex(index)}
                key={user.id}
              >
                <h1 className="text-xl dark:text-white">
                  {user.name === username ? "Eu" : user.name}
                </h1>
                {user.card && (
                  <h1 className="mt-1 text-sm font-semibold uppercase text-[#a2884f] dark:text-emerald-600">
                    votou
                  </h1>
                )}
                {revealCards && user.card && (
                  <motion.h1
                    transition={{
                      delay: (voteCount + 1 * 0.07) / 2,
                    }}
                    initial={{ scale: 0, x: -50 }}
                    animate={{ scale: 1.5, x: 0 }}
                    className="mt-2 text-sm font-semibold uppercase text-[#a2884f] dark:text-emerald-600"
                  >
                    {user.card}
                  </motion.h1>
                )}
              </div>
            );
          })}
      </main>

      <div className="absolute bottom-16 flex items-center gap-6">
        {fibonnaciSequence.map((number) => (
          <button
            disabled={revealCards}
            onClick={() => handleChooseCard(number)}
            key={number}
            style={
              whoami?.card === number
                ? {
                    cursor: revealCards ? "not-allowed" : "pointer",
                    background: mode === "dark" ? "#059669" : "#a2884f",
                  }
                : {
                    cursor: revealCards ? "not-allowed" : "pointer",
                  }
            }
            className="flex h-32 w-16 cursor-pointer items-center justify-center rounded-md border-[1px] border-[#a2884f] dark:border-emerald-600"
          >
            <h1
              style={{
                color:
                  whoami?.card === number && mode === "light" ? "white" : "",
              }}
              className="text-xl font-semibold text-zinc-600 dark:text-white"
            >
              {number}
            </h1>
          </button>
        ))}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { sessionId, userId, username } = ctx.query;
  const cookies = parseCookies(ctx);
  const previousUser = JSON.parse(cookies.user || "{}");

  if (previousUser && (!userId || !username)) {
    return {
      props: {
        sessionId,
        userId: previousUser.id,
        username: previousUser.name,
      },
    };
  }

  return {
    props: {
      sessionId,
      userId: userId ?? null,
      username: username ?? null,
    },
  };
};
