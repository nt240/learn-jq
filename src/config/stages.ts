export type Stage = {
  id: string;
  title: string;
  description: string;
  inputFile: string;
  expectedFile: string;
  defaultFilter: string;
};

export const stages: Stage[] = [
  {
    id: "001",
    title: "基本: 配列の取り出しとmap",
    description: "usersオブジェクトから全てのユーザー名を配列として取得する",
    inputFile: "./problems/problem-001.input.json",
    expectedFile: "./problems/problem-001.expected.json",
    defaultFilter: ".users | map(.name)",
  },
  {
    id: "002",
    title: "フィルタリング: select",
    description:
      "productsから在庫があり、カテゴリが'electronics'の商品のみを抽出する",
    inputFile: "./problems/problem-002.input.json",
    expectedFile: "./problems/problem-002.expected.json",
    defaultFilter:
      '.products | map(select(.inStock and .category == "electronics"))',
  },
  {
    id: "003",
    title: "ソートと選択",
    description: "employeesから部署が'Engineering'の人を給与の高い順に並べる",
    inputFile: "./problems/problem-003.input.json",
    expectedFile: "./problems/problem-003.expected.json",
    defaultFilter:
      '.employees | map(select(.department == "Engineering")) | sort_by(.salary) | reverse',
  },
  {
    id: "004",
    title: "集計とグループ化",
    description:
      "ordersから完了した注文をcustomer別にグループ化し、各顧客の合計金額を求める",
    inputFile: "./problems/problem-004.input.json",
    expectedFile: "./problems/problem-004.expected.json",
    defaultFilter:
      '.orders | map(select(.status == "completed")) | group_by(.customer) | map({(.[0].customer): (map(.amount) | add)}) | add',
  },
  {
    id: "005",
    title: "ネストしたデータの処理",
    description:
      "会社のすべての部署の全従業員が持つすべてのスキルを重複なしのフラットな配列として取得する",
    inputFile: "./problems/problem-005.input.json",
    expectedFile: "./problems/problem-005.expected.json",
    defaultFilter:
      ".company.departments | map(.employees | map(.skills) | flatten) | flatten | unique | sort",
  },
];
