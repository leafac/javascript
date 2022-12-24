import javascript from "tagged-template-noop";
import html from "@leafac/html";
import murmurHash2 from "@emotion/hash";
import assert from "node:assert/strict";

export type JavaScript = string;

export default javascript;

export function localJavaScript(parameters: string = "event"): {
  (javascript_: JavaScript): string;
  toString(): JavaScript;
} {
  let script = "";
  const keys = new Set<string>();

  const output = (javascript_: JavaScript): string => {
    const key = `_${murmurHash2.default(javascript_)}`;
    if (!keys.has(key)) {
      keys.add(key);
      script += javascript`
        ${key}(${parameters}) {
          ${javascript_}
        },
      `;
    }
    return key;
  };

  output.toString = () =>
    html`
      <script key="local-javascript">
        window.localJavaScript = { $${script} };
      </script>
    `;

  return output;
}

if (process.env.TEST === "leafac--javascript") {
  const prettier = await import("prettier");

  const pageJavaScript = localJavaScript();

  assert.equal(
    pageJavaScript(javascript`console.log("Leandro Facchinetti");`),
    "_1cq41gv"
  );
  assert.equal(
    pageJavaScript(javascript`console.log("Louie Renner");`),
    "_ascjc4"
  );
  assert.equal(
    pageJavaScript(javascript`console.log("Louie Renner");`),
    "_ascjc4"
  );

  assert.equal(
    prettier.format(html`$${pageJavaScript.toString()}`, { parser: "html" }),
    prettier.format(
      html`
        <script key="local-javascript">
          window.localJavaScript = {
            _1cq41gv(event) {
              console.log("Leandro Facchinetti");
            },

            _ascjc4(event) {
              console.log("Louie Renner");
            },
          };
        </script>
      `,
      { parser: "html" }
    )
  );
}
