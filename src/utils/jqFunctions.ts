const JQ_MANUAL_BASE = "https://jqlang.org/manual/#";

// jq関数名のリスト
const jqFunctionNames = [
  // 基本フィルター
  "map",
  "select",
  "empty",

  // 型変換
  "tonumber",
  "tostring",
  "toarray",

  // 配列操作
  "length",
  "reverse",
  "sort",
  "sort_by",
  "group_by",
  "unique",
  "unique_by",
  "max",
  "min",
  "max_by",
  "min_by",
  "add",
  "flatten",

  // 文字列操作
  "split",
  "join",
  "startswith",
  "endswith",
  "contains",
  "test",
  "match",

  // オブジェクト操作
  "keys",
  "keys_unsorted",
  "values",
  "has",
  "in",

  // 数学関数
  "floor",
  "ceil",
  "round",
  "sqrt",

  // その他
  "type",
  "not",
  "and",
  "or",
  "any",
  "all",
  "range",
  "recurse",
  "paths",
  "to_entries",
  "from_entries",
  "with_entries",
] as const;

// 関数名から実際のマニュアルのアンカーIDへのマッピング
// 一部の関数は複数の関数がグループ化されている
const functionToAnchor: Record<string, string> = {
  map: "map-map_values",
  keys: "keys-keys_unsorted",
  keys_unsorted: "keys-keys_unsorted",
  sort: "sort-sort_by",
  sort_by: "sort-sort_by",
  unique: "unique-unique_by",
  unique_by: "unique-unique_by",
  max: "min-max-min_by-max_by",
  min: "min-max-min_by-max_by",
  max_by: "min-max-min_by-max_by",
  min_by: "min-max-min_by-max_by",
  to_entries: "to_entries-from_entries-with_entries",
  from_entries: "to_entries-from_entries-with_entries",
  with_entries: "to_entries-from_entries-with_entries",
};

// 関数名からアンカーIDを取得
export function getFunctionAnchor(functionName: string): string {
  return functionToAnchor[functionName] || functionName;
}

// 関数名からURLを生成するヘルパー関数
export function getJqFunctionUrl(functionName: string): string {
  return `${JQ_MANUAL_BASE}${getFunctionAnchor(functionName)}`;
}

// jq関数とそのドキュメントURLのマッピング
export const jqFunctions: Record<string, string> = Object.fromEntries(
  jqFunctionNames.map((name) => [name, getJqFunctionUrl(name)])
);

export function parseJqFilter(
  filter: string
): Array<{ text: string; isFunction: boolean; functionName?: string }> {
  const tokens: Array<{
    text: string;
    isFunction: boolean;
    functionName?: string;
  }> = [];
  const functionNames = Object.keys(jqFunctions).sort(
    (a, b) => b.length - a.length
  );

  const remaining = filter;
  let lastIndex = 0;

  // 関数名を検索する正規表現パターンを作成
  const pattern = new RegExp(`\\b(${functionNames.join("|")})\\b`, "g");

  for (const match of remaining.matchAll(pattern)) {
    const index = match.index ?? 0;

    // マッチ前のテキストを追加
    if (index > lastIndex) {
      tokens.push({
        text: remaining.slice(lastIndex, index),
        isFunction: false,
      });
    }

    // 関数名を追加
    const functionName = match[0];
    tokens.push({ text: functionName, isFunction: true, functionName });

    lastIndex = index + functionName.length;
  }

  // 残りのテキストを追加
  if (lastIndex < remaining.length) {
    tokens.push({ text: remaining.slice(lastIndex), isFunction: false });
  }

  return tokens;
}
