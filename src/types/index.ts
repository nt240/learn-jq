export type JsonTokenKind =
  | "key"
  | "string"
  | "number"
  | "boolean"
  | "null"
  | "punctuation"
  | "text";

export type JsonToken = { kind: JsonTokenKind; text: string };

export type OutputState = {
  kind: "placeholder" | "ok" | "error";
  text: string;
};
