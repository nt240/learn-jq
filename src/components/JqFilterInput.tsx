import { parseJqFilter, jqFunctions } from "../utils/jqFunctions";

type JqFilterInputProps = {
  value: string;
  onChange: (value: string) => void;
  onFunctionClick?: (functionName: string) => void;
};

export function JqFilterInput({
  value,
  onChange,
  onFunctionClick,
}: JqFilterInputProps) {
  const tokens = parseJqFilter(value);

  return (
    <div className="relative h-full">
      {/* 実際の入力フィールド */}
      <textarea
        id="filter-input"
        className="absolute inset-0 w-full h-full resize-none rounded-lg border border-neutral-200 bg-white px-3 py-2 font-mono text-sm leading-5 text-neutral-900 outline-none focus:border-neutral-400 focus:z-10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="例: .users | map(.name)"
        spellCheck={false}
      />

      {/* ハイライト表示用のオーバーレイ（入力時以外） */}
      <div
        className="absolute inset-0 w-full h-full rounded-lg border border-transparent px-3 py-2 font-mono text-sm leading-5 pointer-events-none overflow-auto whitespace-pre-wrap wrap-break-word"
        style={{ color: "transparent" }}
      >
        {tokens.map((token, index) => {
          if (token.isFunction && token.functionName) {
            return (
              <a
                key={index}
                href={jqFunctions[token.functionName]}
                className="text-blue-600 underline hover:text-blue-800 pointer-events-auto cursor-pointer"
                style={{ color: "#2563eb" }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onFunctionClick && token.functionName) {
                    onFunctionClick(token.functionName);
                  }
                }}
              >
                {token.text}
              </a>
            );
          }
          return (
            <span key={index} style={{ color: "#171717" }}>
              {token.text}
            </span>
          );
        })}
      </div>
    </div>
  );
}
