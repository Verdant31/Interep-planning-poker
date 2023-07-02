import { type GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

interface SessionProps {
  session: any;
}

type User = {
  id: string;
  name: string;
};
export default function Session({ session }: SessionProps) {
  const [alreadyJoined, setAlreadyJoined] = useState(false);
  const [, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!session || alreadyJoined) return;
    socket.emit("joinSession", { sessionId: session.id, user: session.user });

    socket.on("joinedSession", (users) => {
      setUsers(users);
      setAlreadyJoined(true);
    });
  }, []);

  const users = [
    { id: "1", name: "João" },
    { id: "2", name: "Maria" },
    { id: "3", name: "José" },
    { id: "4", name: "Pedro" },
    { id: "4", name: "Pedro" },
    { id: "4", name: "Pedro" },
  ];

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <main className="relative mx-auto flex w-[600px] flex-col items-center gap-12  ">
        <button className=" absolute left-[50%] top-[50%] flex h-12 w-60 translate-x-[-50%] translate-y-[-50%] transform items-center justify-center rounded-lg bg-cyan-700">
          <h1 className="text-md cursor-pointer font-semibold uppercase tracking-wider text-white">
            Revelar cartas
          </h1>
        </button>
        {users.length > 0 &&
          users.map((user, index) => {
            return (
              <div
                className="absolute"
                style={getPositionByIndex(index)}
                key={user.id}
              >
                <h1 className="text-xl text-white">
                  {user.name === session.user.name ? "Eu" : user.name}
                </h1>
              </div>
            );
          })}
      </main>
    </div>
  );
}

const getPositionByIndex = (index: number) => {
  const positions = [
    { left: 0 },
    { left: 150, bottom: 102 },
    { right: 150, bottom: 102 },
    { right: 0, top: 0 },
    { right: 150, top: 100 },
    { left: 150, top: 100 },
  ];
  return positions[index];
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { sessionId, userId, username } = query;

  return {
    props: {
      session: {
        id: sessionId,
        user: {
          id: userId,
          name: username,
        },
      },
    },
  };
};
