export type Problem = {
  id: string;
  title: string;
  description: string;
  initialFilter: string;
  inputData: unknown;
  expectedOutput: unknown;
};

export const problems: Problem[] = [
  {
    id: "001",
    title: "基本: 配列の取り出しとmap",
    description:
      "usersオブジェクトから全てのユーザー名を配列として取得してください",
    initialFilter: ".users | map(.name)",
    inputData: await import("../problems/problem-001.input.json").then(
      (m) => m.default
    ),
    expectedOutput: await import("../problems/problem-001.expected.json").then(
      (m) => m.default
    ),
  },
  {
    id: "002",
    title: "フィルタリング: select",
    description:
      "productsから在庫があり、カテゴリが'electronics'の商品のみを抽出してください",
    initialFilter:
      '.products | map(select(.inStock and .category == "electronics"))',
    inputData: await import("../problems/problem-002.input.json").then(
      (m) => m.default
    ),
    expectedOutput: await import("../problems/problem-002.expected.json").then(
      (m) => m.default
    ),
  },
  {
    id: "003",
    title: "ソートと選択",
    description:
      "employeesから部署が'Engineering'の人を給与の高い順に並べてください",
    initialFilter:
      '.employees | map(select(.department == "Engineering")) | sort_by(.salary) | reverse',
    inputData: await import("../problems/problem-003.input.json").then(
      (m) => m.default
    ),
    expectedOutput: await import("../problems/problem-003.expected.json").then(
      (m) => m.default
    ),
  },
  {
    id: "004",
    title: "集計とグループ化",
    description:
      "ordersから完了した注文をcustomer別にグループ化し、各顧客の合計金額を求めてください",
    initialFilter:
      '.orders | map(select(.status == "completed")) | group_by(.customer) | map({(.[0].customer): (map(.amount) | add)}) | add',
    inputData: await import("../problems/problem-004.input.json").then(
      (m) => m.default
    ),
    expectedOutput: await import("../problems/problem-004.expected.json").then(
      (m) => m.default
    ),
  },
  {
    id: "005",
    title: "ネストしたデータの処理",
    description:
      "会社のすべての部署の全従業員が持つすべてのスキルを重複なしのフラットな配列として取得してください",
    initialFilter:
      ".company.departments | map(.employees | map(.skills) | flatten) | flatten | unique | sort",
    inputData: await import("../problems/problem-005.input.json").then(
      (m) => m.default
    ),
    expectedOutput: await import("../problems/problem-005.expected.json").then(
      (m) => m.default
    ),
  },
];
