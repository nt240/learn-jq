import { useEffect, useRef, useState } from "react";

import problem001Input from "./problems/problem-001.input.json";
import problem001Expected from "./problems/problem-001.expected.json";
import { JsonCode } from "./components/JsonCode";
import { Pane } from "./components/Pane";
import { useJq } from "./hooks/useJq";
import type { OutputState } from "./types";

const DEBOUNCE_DELAY_MS = 250;

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

  const expectedOutputPreRef = useRef<HTMLPreElement | null>(null);
  const outputResultPreRef = useRef<HTMLPreElement | null>(null);
  const isSyncingScrollRef = useRef(false);

  const { getJq } = useJq();

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
    }, DEBOUNCE_DELAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [inputJson, filterInput, getJq]);

  const syncScroll = (
    source: HTMLPreElement | null,
    target: HTMLPreElement | null
  ) => {
    if (!source || !target) return;
    if (isSyncingScrollRef.current) return;
    isSyncingScrollRef.current = true;
    target.scrollTop = source.scrollTop;
    target.scrollLeft = source.scrollLeft;
    requestAnimationFrame(() => {
      isSyncingScrollRef.current = false;
    });
  };

  return (
    <div className="flex h-screen justify-center bg-neutral-50">
      <div className="flex h-full w-3/4 flex-col gap-4 px-4 py-6">
        <header className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-neutral-900">Learn jq</h1>
          <p className="text-sm text-neutral-600">
            JSON と jq フィルターを入力して、出力を確認できる学習アプリ
          </p>
        </header>

        <main className="flex flex-1 min-h-0 flex-col gap-4 overflow-auto">
          <Pane title="元のJSON" className="h-[clamp(18rem,45vh,36rem)]">
            <span id="input-json-label" className="sr-only">
              元のJSON
            </span>
            <div className="flex h-full min-h-0 flex-col">
              <pre
                id="input-json"
                role="textbox"
                aria-readonly="true"
                aria-labelledby="input-json-label"
                className="min-h-0 w-full flex-1 overflow-auto rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 font-mono text-sm leading-5"
              >
                <JsonCode text={inputJson} />
              </pre>
            </div>
          </Pane>

          <Pane title="ユーザの入力" className="h-[clamp(10rem,16vh,15rem)]">
            <label className="sr-only" htmlFor="filter-input">
              jq フィルター
            </label>
            <div className="flex h-full min-h-0 flex-col gap-3">
              <textarea
                id="filter-input"
                className="min-h-0 w-full flex-1 resize-none rounded-lg border border-neutral-200 bg-white px-3 py-2 font-mono text-sm leading-5 text-neutral-900 outline-none focus:border-neutral-400"
                value={filterInput}
                onChange={(e) => setFilterInput(e.target.value)}
                placeholder="例: .users | map(.name)"
                spellCheck={false}
              />
            </div>
          </Pane>

          <div className="flex min-h-0 flex-col gap-4 md:flex-row">
            <Pane
              title="想定出力"
              className="h-[clamp(12rem,22vh,20rem)] flex-1"
            >
              <span id="expected-output-label" className="sr-only">
                想定出力
              </span>
              <div className="flex h-full min-h-0 flex-col">
                <pre
                  id="expected-output"
                  ref={expectedOutputPreRef}
                  role="textbox"
                  aria-readonly="true"
                  aria-labelledby="expected-output-label"
                  className="min-h-0 w-full flex-1 overflow-auto rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 font-mono text-sm leading-5"
                  onScroll={() =>
                    syncScroll(
                      expectedOutputPreRef.current,
                      outputResultPreRef.current
                    )
                  }
                >
                  <JsonCode text={expectedOutput} />
                </pre>
              </div>
            </Pane>

            <Pane
              title="出力結果"
              className="h-[clamp(12rem,22vh,20rem)] flex-1"
            >
              <span id="output-result-label" className="sr-only">
                出力結果
              </span>
              <div className="flex h-full min-h-0 flex-col">
                {output.kind === "ok" ? (
                  <pre
                    ref={outputResultPreRef}
                    role="textbox"
                    aria-readonly="true"
                    aria-labelledby="output-result-label"
                    className="min-h-0 w-full flex-1 overflow-auto rounded-lg border border-neutral-200 bg-white px-3 py-2 font-mono text-sm leading-5"
                    onScroll={() =>
                      syncScroll(
                        outputResultPreRef.current,
                        expectedOutputPreRef.current
                      )
                    }
                  >
                    <JsonCode text={output.text || ""} />
                  </pre>
                ) : (
                  <pre
                    ref={outputResultPreRef}
                    role="textbox"
                    aria-readonly="true"
                    aria-labelledby="output-result-label"
                    className={
                      "min-h-0 w-full flex-1 overflow-auto rounded-lg border border-neutral-200 bg-white px-3 py-2 font-mono text-sm leading-5 " +
                      (output.kind === "placeholder"
                        ? "text-neutral-500"
                        : "text-red-700")
                    }
                    onScroll={() =>
                      syncScroll(
                        outputResultPreRef.current,
                        expectedOutputPreRef.current
                      )
                    }
                  >
                    {output.text || ""}
                  </pre>
                )}
              </div>
            </Pane>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
