import { useCallback, useRef, useState } from "react";
import { errorMessage } from "../../services/api";

/**
 * Mesma interface de useAction, mas com clearError para os formulários de auth.
 * Não modifica o hook compartilhado pelas outras telas do Finnitus.
 */
export function useAuthAction() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const running = useRef(false);

  const clearError = useCallback(() => {
    setError("");
  }, []);

  const run = useCallback(async (action: () => Promise<void>) => {
    if (running.current) return;

    running.current = true;
    setBusy(true);
    setError("");

    try {
      await action();
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      running.current = false;
      setBusy(false);
    }
  }, []);

  return { busy, error, run, clearError };
}
