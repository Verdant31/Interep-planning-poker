import { useEffect, useState } from "react";

interface CountdownProps {
  handleStartSession: (copyUrl?: boolean) => void;
  handleRedirectToSession: (passBy?: boolean) => void;
  sessionId: string;
}

export const Countdown = ({
  handleStartSession,
  sessionId,
  handleRedirectToSession,
}: CountdownProps) => {
  const [time, setTime] = useState(10);

  useEffect(() => {
    if (time === 10) handleStartSession(true);
    const timer = setTimeout(() => {
      setTime(time - 1);
    }, 1000);

    if (time === 0) {
      handleRedirectToSession(true);
      clearTimeout(timer);
    }
  }, [time]);

  return (
    <div className="mx-auto flex flex-col items-center justify-center">
      <h1 className="mt-4 text-center text-xl">{time} segundos</h1>
      {sessionId && (
        <button
          onClick={() => handleRedirectToSession(true)}
          className="mt-2 text-[12px] uppercase underline"
        >
          redirecionar agora
        </button>
      )}
    </div>
  );
};
