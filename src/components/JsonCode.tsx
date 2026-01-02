import { tokenizeJson, getTokenColorClass } from "../utils/jsonTokenizer";

type JsonCodeProps = {
  text: string;
};

export function JsonCode({ text }: JsonCodeProps) {
  const tokens = tokenizeJson(text);

  return (
    <code>
      {tokens.map((t, i) => (
        <span key={i} className={getTokenColorClass(t.kind)}>
          {t.text}
        </span>
      ))}
    </code>
  );
}
