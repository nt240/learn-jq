import { stages, type Stage } from "../config/stages";

type StageMenuProps = {
  currentStageId: string;
  onStageSelect: (stageId: string) => void;
};

export function StageMenu({ currentStageId, onStageSelect }: StageMenuProps) {
  return (
    <nav className="group fixed left-0 top-0 z-50 h-full">
      {/* ハンバーガーメニューボタン（常に表示） */}
      <div className="absolute left-0 top-0 flex h-14 w-14 items-center justify-center bg-white border-r border-b border-neutral-200 shadow-sm">
        <button
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
          aria-label="メニュー"
        >
          <span className="block h-0.5 w-6 bg-neutral-700"></span>
          <span className="block h-0.5 w-6 bg-neutral-700"></span>
          <span className="block h-0.5 w-6 bg-neutral-700"></span>
        </button>
      </div>

      {/* ホバー時に展開されるメニュー */}
      <div className="absolute left-0 top-0 h-full w-72 -translate-x-full bg-white shadow-lg transition-transform duration-300 ease-in-out group-hover:translate-x-0">
        <div className="flex h-full flex-col">
          <header className="border-b border-neutral-200 px-4 py-4">
            <h2 className="text-lg font-semibold text-neutral-900">ステージ</h2>
          </header>
          <div className="flex-1 overflow-auto p-2">
            <ul className="space-y-1">
              {stages.map((stage) => (
                <li key={stage.id}>
                  <button
                    onClick={() => onStageSelect(stage.id)}
                    className={
                      "w-full rounded-lg px-4 py-3 text-left transition-colors " +
                      (currentStageId === stage.id
                        ? "bg-sky-100 text-sky-900"
                        : "text-neutral-700 hover:bg-neutral-50")
                    }
                  >
                    <div className="font-medium">{stage.title}</div>
                    <div className="mt-1 text-sm text-neutral-600">
                      {stage.description}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
