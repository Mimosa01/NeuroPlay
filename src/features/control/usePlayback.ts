import { useEffect } from "react";
import { useControlStore } from "./useControlStore";
import { useNetworkStore } from "../network/store/useNetworkStore";

export function usePlayback() {
  const { isPlaying, speed } = useControlStore();
  const { tick } = useNetworkStore();

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      tick();
      useControlStore.setState(state => ({ timeStep: state.timeStep + 1 }));
    }, speed);

    return () => clearInterval(interval);
  }, [isPlaying, tick, speed]);
}
