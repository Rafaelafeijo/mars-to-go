import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { CardDialog } from './CardDialog';

type OpenCard = (id: string) => void;

const Ctx = createContext<OpenCard>(() => {});

/** One dialog for the whole app; any badge can open any card. */
export function CardProvider({ children, onOpen }: { children: ReactNode; onOpen?: (id: string) => void }) {
  const [cardId, setCardId] = useState<string | null>(null);
  const open = useCallback(
    (id: string) => {
      onOpen?.(id);
      setCardId(id);
    },
    [onOpen],
  );
  const value = useMemo(() => open, [open]);
  return (
    <Ctx.Provider value={value}>
      {children}
      <CardDialog cardId={cardId} onClose={() => setCardId(null)} />
    </Ctx.Provider>
  );
}

export function useOpenCard(): OpenCard {
  return useContext(Ctx);
}
