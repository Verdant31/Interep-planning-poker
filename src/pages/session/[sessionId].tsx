import { type GetServerSideProps } from "next";
import { useEffect } from "react";
import io from "socket.io-client";
import { getBaseUrl } from "~/utils/api";

const socket = io("http://localhost:3001");

interface SessionProps {
  session: any;
}

export default function Session({ session }: SessionProps) {
  const sendMessage = () => {
    socket.emit("send_message", {
      message: "Hello World",
      sessionId: session.id,
    });
  };

  useEffect(() => {
    if (!session) return;
    socket.emit("joinSession", session.id);
  }, [session]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      alert(data);
    });
  }, []);

  return (
    <main className="mx-auto mt-32 flex w-96 flex-col items-center gap-12">
      <h1 className="text-white">{session?.id}</h1>
      <button onClick={sendMessage}>Send Message</button>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { sessionId, userId } = query;

  const { session } = await fetch(`${getBaseUrl()}/api/session`, {
    method: "POST",
    body: JSON.stringify({ sessionId, userId }),
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
  });
  console.log(session.users);
  return {
    props: {
      session,
    },
  };
};
