import problem001Input from "../problems/problem-001.input.json";
import problem001Expected from "../problems/problem-001.expected.json";
import problem002Input from "../problems/problem-002.input.json";
import problem002Expected from "../problems/problem-002.expected.json";
import problem003Input from "../problems/problem-003.input.json";
import problem003Expected from "../problems/problem-003.expected.json";
import problem004Input from "../problems/problem-004.input.json";
import problem004Expected from "../problems/problem-004.expected.json";
import problem005Input from "../problems/problem-005.input.json";
import problem005Expected from "../problems/problem-005.expected.json";

export type Stage = {
  id: string;
  title: string;
  description: string;
  inputData: unknown;
  expectedData: unknown;
  defaultFilter: string;
};

export const stages: Stage[] = [
  {
    id: "001",
    title: "基本: 配列の取り出しとmap",
    description: "usersオブジェクトから全てのユーザー名を配列として取得する",
    inputData: problem001Input,
    expectedData: problem001Expected,
    defaultFilter: ".users | map(.name)",
  },
  {
    id: "002",
    title: "フィルタリング: select",
    description:
      "productsから在庫があり、カテゴリが'electronics'の商品のみを抽出する",
    inputData: problem002Input,
    expectedData: problem002Expected,
    defaultFilter:
      '.products | map(select(.inStock and .category == "electronics"))',
  },
  {
    id: "003",
    title: "ソートと選択",
    description: "employeesから部署が'Engineering'の人を給与の高い順に並べる",
    inputData: problem003Input,
    expectedData: problem003Expected,
    defaultFilter:
      '.employees | map(select(.department == "Engineering")) | sort_by(.salary) | reverse',
  },
  {
    id: "004",
    title: "集計とグループ化",
    description:
      "ordersから完了した注文をcustomer別にグループ化し、各顧客の合計金額を求める",
    inputData: problem004Input,
    expectedData: problem004Expected,
    defaultFilter:
      '.orders | map(select(.status == "completed")) | group_by(.customer) | map({(.[0].customer): (map(.amount) | add)}) | add',
  },
  {
    id: "005",
    title: "ネストしたデータの処理",
    description:
      "会社のすべての部署の全従業員が持つすべてのスキルを重複なしのフラットな配列として取得する",
    inputData: problem005Input,
    expectedData: problem005Expected,
    defaultFilter:
      ".company.departments | map(.employees | map(.skills) | flatten) | flatten | unique | sort",
  },
];
