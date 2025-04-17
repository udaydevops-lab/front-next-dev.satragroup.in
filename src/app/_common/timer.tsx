import React, { useEffect, useState } from "react";

interface TimerProps {
  timeout: number;
  onTimeout: () => void;
}

const Timer: React.FC<TimerProps> = ({ timeout, onTimeout }) => {
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIdle(true);
        onTimeout();
      }, timeout);
    };

    resetTimer();

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("keypress", resetTimer);
    window.addEventListener("scroll", resetTimer);
    window.addEventListener("touchstart", resetTimer);
    window.addEventListener("mousedown", resetTimer);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("keypress", resetTimer);
      window.removeEventListener("scroll", resetTimer);
      window.removeEventListener("touchstart", resetTimer);
      window.removeEventListener("mousedown", resetTimer);
    };
  }, [timeout, onTimeout]);

  return null;
};

export default Timer;
