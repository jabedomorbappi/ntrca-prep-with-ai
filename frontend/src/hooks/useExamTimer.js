import { useState } from "react";

export default function useExamTimer(minutes, onExpire) {
  const [time, setTime] = useState(minutes);

  const startTimer = () => {
    let t = minutes * 60;

    const interval = setInterval(() => {
      t--;

      setTime(Math.floor(t / 60));

      if (t <= 0) {
        clearInterval(interval);
        onExpire();
      }
    }, 1000);
  };

  return { time, startTimer };
}