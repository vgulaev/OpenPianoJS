import {Ut} from '../ut.js';

export class Time {
  constructor(xml) {
    this.xml = xml;
    Ut.parseChildren(this, xml);
  }
}
