import {Ut} from '../ut.js';

export class Note {
  constructor(xml) {
    this.xml = xml;
    Ut.parseChildren(this, xml);
  }
}
