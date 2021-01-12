import {StemBuilder} from './xml/stemBuilder.js'

export class PrintMachine {
  constructor(g) {
    this.cursor = 0;
    this.drawClefs = {};
    this.g = g;
    this.sb = new StemBuilder(this)
  }
}
