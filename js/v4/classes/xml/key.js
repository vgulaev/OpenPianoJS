import {Ut} from '../ut.js';

export class Key {
  constructor(xml) {
    this.xml = xml;
    Ut.parseChildren(this, xml);
  }
}
