import { type GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

interface SessionProps {
  session: any;
}

export default function Session({ session }: SessionProps) {
  const [alreadyJoined, setAlreadyJoined] = useState(false);
  useEffect(() => {
    if (!session || alreadyJoined) return;
    socket.emit("joinSession", { sessionId: session.id, user: session.user });

    socket.on("joinedSession", (data) => {
      console.log(data);
      setAlreadyJoined(true);
    });
  }, []);

  return (
    <main className="mx-auto mt-32 flex w-96 flex-col items-center gap-12">
      <h1 className="text-white">{session?.id}</h1>
    </main>
  );
}

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
