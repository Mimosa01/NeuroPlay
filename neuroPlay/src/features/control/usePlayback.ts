import { useEffect } from "react";
import { useControlStore } from "./useControlStore";
import { useNetworkStore } from "../network/store/useNetworkStore";

export function usePlayback() {
  const { isPlaying } = useControlStore();
  const { tick } = useNetworkStore();

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      tick();
      useControlStore.setState(state => ({ timeStep: state.timeStep + 1 }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, tick]);
}
