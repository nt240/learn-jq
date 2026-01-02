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
        "flex min-h-0 min-w-0 flex-col rounded-lg bg-white" +
        (className ? ` ${className}` : "")
      }
    >
      <header className="bg-neutral-50 px-4 py-3">
        <h2 className="text-sm font-semibold text-neutral-900">{title}</h2>
      </header>
      <div className="min-h-0 flex-1 p-4\">{children}</div>
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
    <div className="flex h-screen justify-center overflow-hidden bg-neutral-50">
      <div className="flex h-full w-3/4 flex-col gap-4 px-4 py-6">
        <header className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-neutral-900">Learn jq</h1>
          <p className="text-sm text-neutral-600">
            JSON と jq フィルターを入力して、出力を確認できる学習アプリ
          </p>
        </header>

        <main className="flex flex-1 min-h-0 flex-col gap-4 overflow-hidden md:flex-row">
          <Pane title="元のJSON" className="flex-1 md:flex-[2] min-w-0">
            <label className="sr-only" htmlFor="input-json">
              元のJSON
            </label>
            <div className="flex h-full min-h-0 flex-col">
              <textarea
                id="input-json"
                className="min-h-0 w-full flex-1 resize-none rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 font-mono text-sm leading-5 text-neutral-900 outline-none focus:ring-2 focus:ring-neutral-400"
                value={inputJson}
                readOnly
                spellCheck={false}
              />
            </div>
          </Pane>

          <div className="flex min-h-0 min-w-0 flex-shrink-0 flex-col gap-4 overflow-y-auto md:w-80">
            <Pane
              title="想定出力"
              className="h-[clamp(10rem,16vh,15rem)] max-w-full"
            >
              <label className="sr-only" htmlFor="expected-output">
                想定出力
              </label>
              <div className="flex h-full min-h-0 flex-col">
                <textarea
                  id="expected-output"
                  className="min-h-0 w-full flex-1 resize-none rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 font-mono text-sm leading-5 text-neutral-900 outline-none focus:ring-2 focus:ring-neutral-400"
                  value={expectedOutput}
                  readOnly
                  spellCheck={false}
                />
              </div>
            </Pane>

            <Pane
              title="ユーザの入力"
              className="h-[clamp(10rem,16vh,15rem)] max-w-full"
            >
              <label className="sr-only" htmlFor="filter-input">
                jq フィルター
              </label>
              <div className="flex h-full min-h-0 flex-col gap-3">
                <textarea
                  id="filter-input"
                  className="min-h-0 w-full flex-1 resize-none rounded-lg border border-neutral-200 bg-white px-3 py-2 font-mono text-sm leading-5 text-neutral-900 outline-none focus:ring-2 focus:ring-neutral-400"
                  value={filterInput}
                  onChange={(e) => setFilterInput(e.target.value)}
                  placeholder="例: .users | map(.name)"
                  spellCheck={false}
                />
              </div>
            </Pane>

            <Pane
              title="出力結果"
              className="h-[clamp(10rem,16vh,15rem)] max-w-full"
            >
              <div className="flex h-full min-h-0 flex-col">
                <pre
                  className={
                    "min-h-0 w-full flex-1 overflow-auto rounded-lg border border-neutral-200 bg-white px-3 py-2 font-mono text-sm leading-5 " +
                    (output.kind === "placeholder"
                      ? "text-neutral-500"
                      : output.kind === "error"
                      ? "text-red-700"
                      : "text-neutral-900")
                  }
                >
                  {output.text || ""}
                </pre>
              </div>
            </Pane>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
