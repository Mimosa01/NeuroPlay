import { useEffect, useRef } from "react";
import { useNetworkStore } from "../../network/store/useNetworkStore";
import { useControlStore } from "../store/useControlStore";

export function usePlayback() {
  const { isPlaying, speed } = useControlStore();
  const { tick } = useNetworkStore();

  // Используем ref для хранения последнего времени
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Устанавливаем интервал
    intervalRef.current = setInterval(() => {
      tick();
      useControlStore.setState(state => ({ timeStep: state.timeStep + 1 }));
    }, speed);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, tick, speed]);
}