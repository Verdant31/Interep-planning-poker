/* eslint-disable react-hooks/exhaustive-deps */
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { getPositionByIndex } from "~/utils/getPositionByIndex";

const fibonnaciSequence = [1, 2, 3, 5, 8, 13, 21, 34, 55];

const socket = io("http://localhost:3001");

type User = {
  id: string;
  name: string;
  card?: number;
};

export default function Session() {
  const [alreadyJoined, setAlreadyJoined] = useState(false);
  const [revealCards, setRevealCards] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const router = useRouter();
  const { sessionId, userId, username } = router.query;

  useEffect(() => {
    if (!sessionId || alreadyJoined) return;
    socket.emit("joinSession", {
      sessionId,
      user: { id: userId, name: username, card: null },
    });

    socket.on("joinedSession", (users) => {
      setUsers(users);
      setAlreadyJoined(true);
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
  }, []);

  const handleChooseCard = (card: number) => {
    socket.emit("chooseCard", { sessionId, userId, card });
  };

  const whoami = users.find((user) => user.id === userId);

  const handleResetGame = () => {
    socket.emit("resetGame", { sessionId });
  };

  const handleRevealCards = () => {
    socket.emit("revealCards", { sessionId });
  };

  let voteCount = 0;

  return (
    <div className="relative flex h-screen w-full flex-col items-center">
      <h1>{sessionId}</h1>

      <main className="relative mx-auto mt-[300px] flex w-[600px] flex-col items-center gap-12">
        <button
          onClick={() =>
            !revealCards ? handleRevealCards() : handleResetGame()
          }
          className=" absolute left-[50%] top-[50%] flex h-12 w-60 translate-x-[-50%] translate-y-[-50%] transform items-center justify-center rounded-lg bg-emerald-600"
        >
          <h1 className="text-md cursor-pointer font-semibold uppercase tracking-wider text-white">
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
                <h1 className="text-xl text-white">
                  {user.name === username ? "Eu" : user.name}
                </h1>
                {user.card && (
                  <h1 className="mt-1 text-sm font-semibold uppercase text-emerald-600">
                    votou
                  </h1>
                )}
                {revealCards && user.card && (
                  <motion.h1
                    transition={{
                      delay: (voteCount + 1 * 0.1) / 2,
                    }}
                    initial={{ scale: 0, x: -50 }}
                    animate={{ scale: 1.5, x: 0 }}
                    className="mt-2 text-sm font-semibold uppercase text-emerald-500"
                  >
                    {user.card}
                  </motion.h1>
                )}
              </div>
            );
          })}
      </main>

      <div className="absolute bottom-24 flex items-center gap-6">
        {fibonnaciSequence.map((number) => (
          <div
            onClick={() => handleChooseCard(number)}
            key={number}
            style={{ background: whoami?.card === number ? "#059669" : "" }}
            className="flex h-32 w-16 cursor-pointer items-center justify-center rounded-md border-[1px] border-emerald-600"
          >
            <h1 className="text-xl font-semibold text-white">{number}</h1>
          </div>
        ))}
      </div>
    </div>
  );
}
