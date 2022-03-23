import assert from "node:assert/strict";
import javascript from "tagged-template-noop";
import { HTML, html } from "@leafac/html";

export type JavaScript = string;
export { default as javascript } from "tagged-template-noop";

export function HTMLForJavaScript(): {
  (html_: HTML): JavaScript;
  toString(): HTML;
} {
  const parts: HTML[] = [];
  const adder = (html_: HTML): JavaScript => {
    const className = `html-for-javascript--${parts.length}`;
    parts.push(html`<div class="${className}">$${html_}</div>`);
    return javascript`document.querySelector(".${className}")`;
  };
  adder.toString = () =>
    html`<div hidden class="html-for-javascript">$${parts}</div>`;
  return adder;
}
if (process.env.TEST === "leafac--javascript") {
  const exampleHTMLForJavaScript = HTMLForJavaScript();
  assert.equal(
    exampleHTMLForJavaScript(html`<p>Example</p>`),
    `document.querySelector(".html-for-javascript--0")`
  );
  assert.equal(
    exampleHTMLForJavaScript(html`<p>Example</p>`),
    `document.querySelector(".html-for-javascript--1")`
  );
  assert.equal(
    html`$${exampleHTMLForJavaScript.toString()}`,
    `<div hidden class="html-for-javascript"><div class="html-for-javascript--0"><p>Example</p></div><div class="html-for-javascript--1"><p>Example</p></div></div>`
  );
}
