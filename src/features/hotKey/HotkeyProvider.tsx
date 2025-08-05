import { HotkeyHint } from './components/HotkeyHint';
import { useHotkey } from './hooks/useHotkey';

export const HotkeyProvider = ({ children }: { children: React.ReactNode }) => {
  useHotkey();
  
  return (
    <>
      {children}
      <HotkeyHint />
    </>
  );
};