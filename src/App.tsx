import { useEffect, useRef, useState } from "react";

import { JsonCode } from "./components/JsonCode";
import { Pane } from "./components/Pane";
import { StageMenu } from "./components/StageMenu";
import { HelpMenu } from "./components/HelpMenu";
import { JqFilterInput } from "./components/JqFilterInput";
import { stages } from "./config/stages";
import { useJq } from "./hooks/useJq";
import { getFunctionAnchor } from "./utils/jqFunctions";
import type { OutputState } from "./types";

const DEBOUNCE_DELAY_MS = 250;

// URLから初期ステージIDとフィルター入力を取得
function getInitialState(): { stageId: string; filter?: string } {
  const params = new URLSearchParams(window.location.search);
  const hash = window.location.hash.slice(1); // #を除去
  const filter = params.get("filter");

  const stageId =
    hash && stages.some((s) => s.id === hash) ? hash : stages[0].id;

  return { stageId, filter: filter || undefined };
}

function App() {
  const initialState = getInitialState();
  const initialStage =
    stages.find((s) => s.id === initialState.stageId) || stages[0];

  const [currentStageId, setCurrentStageId] = useState<string>(
    initialState.stageId
  );
  const [filterInput, setFilterInput] = useState<string>(
    initialState.filter || initialStage.defaultFilter
  );
  const [output, setOutput] = useState<OutputState>({
    kind: "placeholder",
    text: "（ここに実行結果を表示します）",
  });
  const [helpMenuOpen, setHelpMenuOpen] = useState(false);
  const [helpMenuAnchor, setHelpMenuAnchor] = useState<string>("");

  const expectedOutputPreRef = useRef<HTMLPreElement | null>(null);
  const outputResultPreRef = useRef<HTMLPreElement | null>(null);
  const isSyncingScrollRef = useRef(false);

  const { getJq } = useJq();

  // 現在のステージを取得
  const currentStage = stages.find((s) => s.id === currentStageId);

  // jq関数リンクをクリックした時のハンドラー
  const handleFunctionClick = (functionName: string) => {
    const anchor = getFunctionAnchor(functionName);
    setHelpMenuAnchor(anchor);
    setHelpMenuOpen(true);
  };

  // URLを更新するヘルパー関数
  const updateURL = (stageId: string, filter: string) => {
    const url = new URL(window.location.href);
    url.hash = stageId;
    if (filter) {
      url.searchParams.set("filter", filter);
    } else {
      url.searchParams.delete("filter");
    }
    window.history.replaceState({}, "", url.toString());
  };

  // ステージ選択時の処理
  const handleStageSelect = (stageId: string) => {
    setCurrentStageId(stageId);
    const stage = stages.find((s) => s.id === stageId);
    if (stage) {
      setFilterInput(stage.defaultFilter);
      setOutput({
        kind: "placeholder",
        text: "（ここに実行結果を表示します）",
      });

      // URLを更新（pushStateで履歴に追加）
      const url = new URL(window.location.href);
      url.hash = stageId;
      url.searchParams.set("filter", stage.defaultFilter);
      window.history.pushState({}, "", url.toString());
    }
  };

  // ブラウザの戻る/進むボタンに対応
  useEffect(() => {
    const handleHashChange = () => {
      const state = getInitialState();
      setCurrentStageId(state.stageId);
      const stage = stages.find((s) => s.id === state.stageId);
      if (stage) {
        setFilterInput(state.filter || stage.defaultFilter);
        setOutput({
          kind: "placeholder",
          text: "（ここに実行結果を表示します）",
        });
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);
  // フィルター入力が変更されたときにURLを更新（デバウンス）
  useEffect(() => {
    const timer = setTimeout(() => {
      updateURL(currentStageId, filterInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [filterInput, currentStageId]);
  const inputJson = currentStage
    ? JSON.stringify(currentStage.inputData, null, 2)
    : "";
  const expectedOutput = currentStage
    ? JSON.stringify(currentStage.expectedData, null, 2)
    : "";

  useEffect(() => {
    if (!currentStage) return;
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
  }, [inputJson, filterInput, getJq, currentStage]);

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
      {/* 左側：ステージメニュー */}
      <StageMenu
        currentStageId={currentStageId}
        onStageSelect={handleStageSelect}
      />

      {/* 右側：ヘルプメニュー */}
      <HelpMenu
        isOpen={helpMenuOpen}
        onOpen={() => setHelpMenuOpen(true)}
        onClose={() => setHelpMenuOpen(false)}
        anchor={helpMenuAnchor}
      />

      {/* メインコンテンツ */}
      <div
        className={`flex w-3/4 flex-col gap-4 overflow-auto px-8 py-6 ml-14 mr-14 transition-transform duration-300 ease-in-out ${
          helpMenuOpen ? "translate-x-[-14vw]" : ""
        }`}
      >
        {currentStage && (
          <header className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-neutral-900">
              {currentStage.title}
            </h2>
            <p className="text-sm text-neutral-600">
              {currentStage.description}
            </p>
          </header>
        )}

        <main className="flex flex-1 min-h-0 flex-col gap-4">
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
              <JqFilterInput
                value={filterInput}
                onChange={setFilterInput}
                onFunctionClick={handleFunctionClick}
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
