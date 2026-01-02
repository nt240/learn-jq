declare module "jq-web" {
  type JqWeb = {
    json: (input: unknown, filter: string) => Promise<unknown>;
    raw: (input: string, filter: string) => Promise<string>;
  };

  const jqWeb: Promise<JqWeb>;
  export default jqWeb;
}
