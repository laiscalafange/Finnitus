import { useRef, useState } from "react";

import { errorMessage } from "../../services/api";

export function useAction() {
  const locked = useRef(false);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function run(
    action: () => Promise<void>
  ) {
    if (locked.current) {
      return;
    }

    locked.current = true;
    setBusy(true);
    setError("");

    try {
      await action();
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      locked.current = false;
      setBusy(false);
    }
  }

  return {
    busy,
    error,
    setError,
    run,
  };
}