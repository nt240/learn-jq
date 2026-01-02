import { useRef } from "react";

type JqInstance = {
  json: (input: unknown, filter: string) => Promise<unknown>;
};

export function useJq() {
  const jqRef = useRef<Promise<JqInstance> | null>(null);

  const getJq = async (): Promise<JqInstance> => {
    if (!jqRef.current) {
      // jq-web (Emscripten) looks for jq.wasm next to the JS bundle by default.
      // In Vite, the wasm file is emitted as an asset with a hashed name, so we
      // override locateFile to point to the correct URL.
      const g = globalThis as unknown as { Module?: Record<string, unknown> };
      g.Module = g.Module ?? {};
      (g.Module as Record<string, unknown>).locateFile = (path: string) => {
        return path.endsWith("jq.wasm") ? "/jq.wasm" : path;
      };

      jqRef.current = import("jq-web").then((m) => m.default);
    }
    return jqRef.current;
  };

  return { getJq };
}
