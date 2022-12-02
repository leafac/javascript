import javascript from "tagged-template-noop";
import html, { HTML } from "@leafac/html";
import assert from "node:assert/strict";

export type JavaScript = string;

export default javascript;

export function HTMLForJavaScript(): {
  (html_: HTML): JavaScript;
  toString(): HTML;
} {
  let markup = "";
  let counter = 0;

  const output = (html_: HTML): JavaScript => {
    const key = `html-for-javascript--${counter}`;
    markup += html`<div key="${key}">$${html_}</div>`;
    counter++;
    return javascript`document.querySelector('[key="html-for-javascript"] > [key="${key}"]')`;
  };

  output.toString = () =>
    html`<div key="html-for-javascript" hidden>$${markup}</div>`;

  return output;
}

if (process.env.TEST === "leafac--javascript") {
  const exampleHTMLForJavaScript = HTMLForJavaScript();
  assert.equal(
    exampleHTMLForJavaScript(html`<p>Example</p>`),
    `document.querySelector('[key="html-for-javascript"] > [key="html-for-javascript--0"]')`
  );
  assert.equal(
    exampleHTMLForJavaScript(html`<p>Example</p>`),
    `document.querySelector('[key="html-for-javascript"] > [key="html-for-javascript--1"]')`
  );
  assert.equal(
    html`$${exampleHTMLForJavaScript.toString()}`,
    `<div key="html-for-javascript" hidden><div key="html-for-javascript--0"><p>Example</p></div><div key="html-for-javascript--1"><p>Example</p></div></div>`
  );
}
