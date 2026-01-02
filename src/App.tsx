import { useEffect, useRef, useState } from "react";

import problem001Input from "./problems/problem-001.input.json";
import problem001Expected from "./problems/problem-001.expected.json";

type PaneProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

function Pane({ title, children, className }: PaneProps) {
  return (
    <section
      className={
        "flex min-h-0 flex-col rounded-lg border border-neutral-200 bg-white" +
        (className ? ` ${className}` : "")
      }
    >
      <header className="border-b border-neutral-200 bg-neutral-50 px-4 py-3">
        <h2 className="text-sm font-semibold text-neutral-900">{title}</h2>
      </header>
      <div className="min-h-0 flex-1 p-4">{children}</div>
    </section>
  );
}

type OutputState = {
  kind: "placeholder" | "ok" | "error";
  text: string;
};

function App() {
  const [inputJson] = useState<string>(
    JSON.stringify(problem001Input, null, 2)
  );
  const [expectedOutput] = useState<string>(
    JSON.stringify(problem001Expected, null, 2)
  );
  const [filterInput, setFilterInput] = useState<string>(".users | map(.name)");
  const [output, setOutput] = useState<OutputState>({
    kind: "placeholder",
    text: "（ここに実行結果を表示します）",
  });

  const jqRef = useRef<Promise<{
    json: (input: unknown, filter: string) => Promise<unknown>;
  }> | null>(null);

  const getJq = async () => {
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

  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(async () => {
      const trimmedFilter = filterInput.trim();
      if (trimmedFilter.length === 0) {
        setOutput({ kind: "ok", text: "" });
        return;
      }

      let parsedJson: unknown;
      try {
        parsedJson = JSON.parse(inputJson);
      } catch (e) {
        if (cancelled) return;
        const message = e instanceof Error ? e.message : String(e);
        setOutput({ kind: "error", text: `JSON パースエラー: ${message}` });
        return;
      }

      if (cancelled) return;
      setOutput({ kind: "placeholder", text: "実行中..." });

      try {
        const jq = await getJq();
        const result = await jq.json(parsedJson, trimmedFilter);
        if (cancelled) return;
        setOutput({
          kind: "ok",
          text: JSON.stringify(result, null, 2) ?? "",
        });
      } catch (e) {
        if (cancelled) return;
        const stderr =
          typeof e === "object" && e !== null && "stderr" in e
            ? String((e as { stderr: unknown }).stderr)
            : null;
        const message = stderr || (e instanceof Error ? e.message : String(e));
        setOutput({ kind: "error", text: message });
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [inputJson, filterInput]);

  return (
    <div className="flex min-h-screen justify-center bg-neutral-50">
      <div className="flex w-full max-w-6xl flex-col gap-4 px-4 py-6">
        <header className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-neutral-900">Learn jq</h1>
          <p className="text-sm text-neutral-600">
            JSON と jq フィルターを入力して、出力を確認できる学習アプリ（UI
            の土台）
          </p>
        </header>

        <main className="grid min-h-[70vh] grid-cols-1 gap-4 md:grid-cols-2 md:grid-rows-3">
          <Pane title="元のJSON" className="md:row-span-3">
            <label className="sr-only" htmlFor="input-json">
              元のJSON
            </label>
            <div className="flex h-full min-h-0 flex-col">
              <textarea
                id="input-json"
                className="min-h-[15vh] w-full flex-1 resize-none rounded-md border border-neutral-300 bg-neutral-50 px-3 py-2 font-mono text-sm leading-5 text-neutral-900 outline-none focus:ring-2 focus:ring-neutral-300 md:min-h-24"
                value={inputJson}
                readOnly
                spellCheck={false}
              />
            </div>
          </Pane>

          <Pane title="想定出力" className="md:col-start-2 md:row-start-1">
            <label className="sr-only" htmlFor="expected-output">
              想定出力
            </label>
            <div className="flex h-full min-h-0 flex-col">
              <textarea
                id="expected-output"
                className="min-h-28 w-full flex-1 resize-none rounded-md border border-neutral-300 bg-neutral-50 px-3 py-2 font-mono text-sm leading-5 text-neutral-900 outline-none focus:ring-2 focus:ring-neutral-300 md:min-h-40"
                value={expectedOutput}
                readOnly
                spellCheck={false}
              />
            </div>
          </Pane>

          <Pane title="ユーザの入力" className="md:col-start-2 md:row-start-2">
            <label className="sr-only" htmlFor="filter-input">
              jq フィルター
            </label>
            <div className="flex h-full min-h-0 flex-col gap-3">
              <textarea
                id="filter-input"
                className="min-h-28 w-full flex-1 resize-none rounded-md border border-neutral-300 bg-white px-3 py-2 font-mono text-sm leading-5 text-neutral-900 outline-none focus:ring-2 focus:ring-neutral-300 md:min-h-40"
                value={filterInput}
                onChange={(e) => setFilterInput(e.target.value)}
                placeholder="例: .users | map(.name)"
                spellCheck={false}
              />
            </div>
          </Pane>

          <Pane title="出力結果" className="md:col-start-2 md:row-start-3">
            <div className="flex h-full min-h-0 flex-col">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-neutral-600">実行結果</span>
                <button
                  type="button"
                  className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-xs text-neutral-900 hover:bg-neutral-50"
                  onClick={() => setOutput({ kind: "ok", text: "" })}
                >
                  クリア
                </button>
              </div>
              <pre
                className={
                  "min-h-28 flex-1 overflow-auto rounded-md border border-neutral-300 bg-white p-3 font-mono text-sm md:min-h-40 " +
                  (output.kind === "placeholder"
                    ? "text-neutral-500"
                    : output.kind === "error"
                    ? "text-red-700"
                    : "text-neutral-900")
                }
              >
                {output.text || "（空）"}
              </pre>
            </div>
          </Pane>
        </main>
      </div>
    </div>
  );
}

export default App;
