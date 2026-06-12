import { useEffect, useRef } from "react";

export default function useTimer(initialDuration, setTime, callback) {
  const intervalRef = useRef(null);

  useEffect(() => {
    // Only start if we have a valid positive duration
    if (initialDuration <= 0) return;

    // Set the initial time provided by the API
    setTime(initialDuration);

    intervalRef.current = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          callback?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup on unmount
    return () => clearInterval(intervalRef.current);
  }, [initialDuration]); // Only re-run if the API-provided duration changes!
  
  // Note: We removed 'time' from the dependency array so it doesn't loop
}