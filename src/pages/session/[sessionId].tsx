/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type GetServerSideProps } from "next";
import { getBaseUrl } from "~/utils/api";

interface SessionProps {
  session: any;
}

export default function Session({ session }: SessionProps) {
  console.log(session);
  return (
    <main className="mx-auto mt-32 flex w-96 flex-col items-center gap-12">
      <h1 className="text-white">{session?.session?.id}</h1>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { sessionId } = query;

  const session = await fetch(`${getBaseUrl()}/api/session`, {
    method: "POST",
    body: JSON.stringify({ sessionId }),
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
  });

  return {
    props: {
      session,
    },
  };
};
