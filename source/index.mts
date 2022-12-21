import javascript from "tagged-template-noop";
import html, { HTML } from "@leafac/html";
import murmurHash2 from "@emotion/hash";
import assert from "node:assert/strict";

export type JavaScript = string;

export default javascript;

export function localHTMLForJavaScript(): {
  (html_: HTML): JavaScript;
  toString(): HTML;
} {
  let markup = "";
  let counter = 0;

  const output = (html_: HTML): JavaScript => {
    const key = `html-for-javascript--${counter}`;
    markup += html`<div key="${key}">$${html_}</div>`;
    counter++;
    return javascript`(() => { const element = document.querySelector('[key="html-for-javascript"] > [key="${key}"]'); element.remove(); return element; })()`;
  };

  output.toString = () =>
    html`<div key="html-for-javascript" hidden>$${markup}</div>`;

  return output;
}

if (process.env.TEST === "leafac--javascript") {
  const pageHTMLForJavaScript = localHTMLForJavaScript();
  assert.equal(
    pageHTMLForJavaScript(html`<p>Example</p>`),
    `(() => { const element = document.querySelector('[key="html-for-javascript"] > [key="html-for-javascript--0"]'); element.remove(); return element; })()`
  );
  assert.equal(
    pageHTMLForJavaScript(html`<p>Example</p>`),
    `(() => { const element = document.querySelector('[key="html-for-javascript"] > [key="html-for-javascript--1"]'); element.remove(); return element; })()`
  );
  assert.equal(
    html`$${pageHTMLForJavaScript.toString()}`,
    `<div key="html-for-javascript" hidden><div key="html-for-javascript--0"><p>Example</p></div><div key="html-for-javascript--1"><p>Example</p></div></div>`
  );
}

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
