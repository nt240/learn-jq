import problem001 from "../problems/problem-001.json";
import problem002 from "../problems/problem-002.json";
import problem003 from "../problems/problem-003.json";
import problem004 from "../problems/problem-004.json";
import problem005 from "../problems/problem-005.json";

export type Stage = {
  id: string;
  title: string;
  description: string;
  inputData: unknown;
  expectedData: unknown;
  defaultFilter: string;
};

const problems = [problem001, problem002, problem003, problem004, problem005];

export const stages: Stage[] = problems.map((problem) => ({
  id: problem.id,
  title: problem.title,
  description: problem.description,
  inputData: problem.input,
  expectedData: problem.expected,
  defaultFilter: problem.defaultFilter,
}));
