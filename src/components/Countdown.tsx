import { useEffect, useState } from "react";
import { StartSessionProps } from "~/hooks/useHome";

interface CountdownProps {
  handleStartSession: ({ copyUrl, createdUser }: StartSessionProps) => void;
  handleRedirectToSession: () => void;
  sessionId: string;
}

export const Countdown = ({
  handleStartSession,
  sessionId,
  handleRedirectToSession,
}: CountdownProps) => {
  const [time, setTime] = useState(10);

  useEffect(() => {
    if (time === 10) handleStartSession({ copyUrl: true });
    const timer = setTimeout(() => {
      setTime(time - 1);
    }, 1000);

    if (time === 0) {
      handleRedirectToSession();
      clearTimeout(timer);
    }
  }, [time]);

  return (
    <div className="mx-auto flex flex-col items-center justify-center">
      <h1 className="mt-4 text-center text-xl">{time} segundos</h1>
      {sessionId && (
        <button
          onClick={handleRedirectToSession}
          className="mt-2 text-[12px] uppercase underline"
        >
          redirecionar agora
        </button>
      )}
    </div>
  );
};
