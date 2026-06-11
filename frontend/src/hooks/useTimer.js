// frontend/src/hooks/useTimer.js

import { useEffect } from "react";

export default function useTimer(time, setTime, callback) {

  useEffect(() => {

    // safety check
    if (typeof setTime !== "function") {
      console.error("❌ setTime is not a function");
      return;
    }

    if (time <= 0) {
      callback?.();
      return;
    }

    const interval = setInterval(() => {

      setTime(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          callback?.();
          return 0;
        }
        return prev - 1;
      });

    }, 1000);

    return () => clearInterval(interval);

  }, [time]);
}