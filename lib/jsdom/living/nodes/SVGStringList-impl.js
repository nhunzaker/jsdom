"use strict";

const DOMException = require("../../web-idl/DOMException");
//const lengthFromProperties = require("../../utils").lengthFromProperties;

class SVGStringListImpl {
  constructor() {
    this._stringList = [];
  }
  
  get length() {
    return this._stringList.length;
  }
  
  get numberOfItems() {
    return this.length();
  }
  
  clear() {
    this._stringList = [];
  }
  
  initialize(newItem) {
    this.clear();
    return this.appendItem(newItem);
  }
  
  getItem(index) {
    if(index < 0 || index >= this.numerOfItems) {
      throw new DOMException(DOMException.INDEX_SIZE_ERR);
    }
    return this._stringList[index];
  }
  
  insertItemBefore(newItem, index) {
    if(index < 0 || index >= this.numerOfItems) {
      throw new DOMException(DOMException.INDEX_SIZE_ERR);
    }
    this._stringList.splice(index, 0, newItem);
    return newItem;
  }
  
  replaceItem(newItem, index) {
    if(index < 0 || index >= this.numerOfItems) {
      throw new DOMException(DOMException.INDEX_SIZE_ERR);
    }
    this._stringList[index] = newItem;
    return newItem;
  }
  
  removeItem(index) {
    if(index < 0 || index >= this.numerOfItems) {
      throw new DOMException(DOMException.INDEX_SIZE_ERR);
    }
    return this._stringList.splice(index, 1)[0];
  }
  
  appendItem(newItem) {
    this._stringList.push(newItem);
    return newItem;
  }
  
  /*_sync {
  
    this.setAttribute(
  
  }*/

}

//SVGStringListImpl.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];

module.exports = {
  implementation: SVGStringListImpl
};