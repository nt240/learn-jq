export function HelpMenu() {
  return (
    <nav className="group fixed right-0 top-0 z-50 h-full">
      {/* ハンバーガーメニューボタン（常に表示） */}
      <div className="absolute right-0 top-0 flex h-14 w-14 items-center justify-center bg-white border-l border-b border-neutral-200 shadow-sm">
        <button
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
          aria-label="ヘルプメニュー"
        >
          <span className="block h-0.5 w-6 bg-neutral-700"></span>
          <span className="block h-0.5 w-6 bg-neutral-700"></span>
          <span className="block h-0.5 w-6 bg-neutral-700"></span>
        </button>
      </div>

      {/* ホバー時に展開されるメニュー */}
      <div className="absolute right-0 top-0 h-full w-150 translate-x-full bg-white shadow-lg transition-transform duration-300 ease-in-out group-hover:translate-x-0">
        <div className="flex h-full flex-col">
          <header className="border-b border-neutral-200 px-4 py-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">
              jq Manual
            </h2>
            <a
              href="https://jqlang.github.io/jq/manual/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              新しいタブで開く
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </header>
          <div className="flex-1 overflow-hidden">
            <iframe
              src="https://jqlang.github.io/jq/manual/"
              className="w-full h-full border-0"
              title="jq Manual"
            />
          </div>
          <footer className="border-t border-neutral-200 px-4 py-3">
            <a
              href="https://github.com/jqlang/jq"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-neutral-700 hover:text-neutral-900 transition-colors"
            >
              <svg
                className="h-5 w-5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              <div>
                <div className="font-medium">GitHub</div>
                <div className="text-xs text-neutral-600">jqのソースコード</div>
              </div>
            </a>
          </footer>
        </div>
      </div>
    </nav>
  );
}
