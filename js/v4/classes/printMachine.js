import {StemBuilder} from './xml/stemBuilder.js'
import {TieBuilder} from './xml/tieBuilder.js'

export class PrintMachine {
  constructor(sheet) {
    this.cursor = 0;
    this.drawClefs = {};
    this.g = sheet.g;
    this.secondLayer = sheet.secondLayer;
    this.sb = new StemBuilder(this);
    this.tb = new TieBuilder(this);
    this.sheet = sheet
  }
}
