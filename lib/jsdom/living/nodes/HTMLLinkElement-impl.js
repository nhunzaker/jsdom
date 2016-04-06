"use strict";
const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const LinkStyleImpl = require("./LinkStyle-impl").implementation;
const idlUtils = require("../generated/utils");
<<<<<<< 95b3fd98c1bbf8abdcf6a9ffa67eb89c52578ee1
const reflectURLAttribute = require("../../utils").reflectURLAttribute;
const fetchStylesheet = require("../helpers/stylesheets").fetchStylesheet;
const parseURLToResultingURLRecord = require("../helpers/document-base-url").parseURLToResultingURLRecord;
const whatwgURL = require("whatwg-url");

// Important reading: "appropriate times to obtain the resource" in
// https://html.spec.whatwg.org/multipage/semantics.html#link-type-stylesheet
=======
const normalizeEncoding = require("../helpers/encoding").normalizeEncoding;

const resourceLoader = require("../../browser/resource-loader");
const resolveHref = require("../../utils").resolveHref;

/**
 * @this {core.HTMLLinkElement|core.HTMLStyleElement}
 * @param {string} url
 * @param {cssom.CSSStyleSheet} sheet
 * @see http://dev.w3.org/csswg/cssom/#requirements-on-user-agents-implementing0
 */
function fetchStylesheet(url, sheet) {
  resourceLoader.load(this,
  url,
  { defaultEncoding: normalizeEncoding(this.getAttribute("charset")) || this._ownerDocument._encoding },
  data => {
    // TODO: abort if the content-type is not text/css, and the document is
    // in strict mode
    url = sheet.href = resourceLoader.resolveResourceUrl(this.ownerDocument, url);
    evaluateStylesheet.call(this, data, sheet, url);
  });
}
/**
 * @this {core.HTMLLinkElement|core.HTMLStyleElement}
 * @param {string} data
 * @param {cssom.CSSStyleSheet} sheet
 * @param {string} baseUrl
 */
function evaluateStylesheet(data, sheet, baseUrl) {
  // this is the element
  const newStyleSheet = cssom.parse(data);
  const spliceArgs = newStyleSheet.cssRules;
  spliceArgs.unshift(0, sheet.cssRules.length);
  Array.prototype.splice.apply(sheet.cssRules, spliceArgs);
  scanForImportRules.call(this, sheet.cssRules, baseUrl);
  this.ownerDocument.styleSheets.push(sheet);
}
/**
 * @this {core.HTMLLinkElement|core.HTMLStyleElement}
 * @param {cssom.CSSStyleSheet} sheet
 * @param {string} baseUrl
 */
function scanForImportRules(cssRules, baseUrl) {
  if (!cssRules) {
    return;
  }
>>>>>>> Add encoding handling

class HTMLLinkElementImpl extends HTMLElementImpl {
  _attach() {
    super._attach();

    if (isExternalResourceLink(this)) {
      obtainTheResource(this);
    }
  }

  _attrModified(name, value, oldValue) {
    super._attrModified(name, value, oldValue);

    if (name === "href" && this._attached && isExternalResourceLink(this)) {
      obtainTheResource(this);
    }
  }

  get _accept() {
    return "text/css,*/*;q=0.1";
  }

  get href() {
    return reflectURLAttribute(this, "href");
  }

  set href(value) {
    this.setAttribute("href", value);
  }
}

idlUtils.mixin(HTMLLinkElementImpl.prototype, LinkStyleImpl.prototype);

module.exports = {
  implementation: HTMLLinkElementImpl
};

function obtainTheResource(el) {
  const href = el.getAttribute("href");

  if (href === null || href === "") {
    return;
  }

  const url = parseURLToResultingURLRecord(href, el._ownerDocument);
  if (url === "failure") {
    return;
  }

  const serialized = whatwgURL.serializeURL(url);

  fetchStylesheet(el, serialized, el.sheet);
}

function isExternalResourceLink(el) {
  // for our purposes, only stylesheets can be external resource links
  const wrapper = idlUtils.wrapperForImpl(el);
  if (!/(?:[ \t\n\r\f]|^)stylesheet(?:[ \t\n\r\f]|$)/i.test(wrapper.rel)) {
    // rel is a space-separated list of tokens, and the original rel types
    // are case-insensitive.
    return false;
  }

  return Boolean(el.href);
}
