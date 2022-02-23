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
    const className = `html-for-javascript--${Math.random()
      .toString(36)
      .slice(2)}`;
    parts.push(html`<div class="${className}">$${html_}</div>`);
    return javascript`document.querySelector(".${className}")`;
  };
  adder.toString = () =>
    html`<div hidden class="html-for-javascript">$${parts}</div>`;
  return adder;
}
if (process.env.TEST === "leafac--javascript") {
  let fakeRandomNumber = 0.1;
  Math.random = () => {
    fakeRandomNumber = (fakeRandomNumber + 0.7) % 1;
    return fakeRandomNumber;
  };
  const exampleHTMLForJavaScript = HTMLForJavaScript();
  assert.equal(
    exampleHTMLForJavaScript(html`<p>Example</p>`),
    `document.querySelector(".html-for-javascript--ssssssssssi")`
  );
  assert.equal(
    exampleHTMLForJavaScript(html`<p>Example</p>`),
    `document.querySelector(".html-for-javascript--i")`
  );
  assert.equal(
    html`$${exampleHTMLForJavaScript.toString()}`,
    `<div hidden class="html-for-javascript"><div class="html-for-javascript--ssssssssssi"><p>Example</p></div><div class="html-for-javascript--i"><p>Example</p></div></div>`
  );
}
