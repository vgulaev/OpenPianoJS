import {Ut} from './ut.js';
import {Measure} from './xml/measure.js'
import {SVGBuilder} from './svgBuilder.js';
import {PrintMachine} from './printMachine.js'

export class Sheet {
  constructor(app) {
    this.app = app;
    this.grandStaff = app.grandStaff;
    this.createRenderRoot();
    this.init();
  }

  init() {
    this.measures = [];
    this.items = [];
    this.firstLayer.innerHTML = '';
    this.secondLayer.innerHTML = '';
    this.errors = 0;
    this.pm = new PrintMachine(this);
  }

  createRenderRoot() {
    this.sheetMusic = SVGBuilder.createSVG('g');
    this.sheetMusic.setAttributeNS(null, 'id', 'SheetMusic');

    this.firstLayer = SVGBuilder.createSVG('g');
    this.firstLayer.setAttributeNS(null, 'id', 'firstLayer');
    this.sheetMusic.append(this.firstLayer);
    this.secondLayer = SVGBuilder.createSVG('g');
    this.secondLayer.setAttributeNS(null, 'id', 'secondLayer');
    this.sheetMusic.append(this.secondLayer);

    this.g = this.firstLayer;

    this.grandStaff.body.root.append(this.sheetMusic);
  }

  parseXML(data) {
    let p = new DOMParser();
    let xml = p.parseFromString(data, 'text/xml');

    let nodes = xml.querySelectorAll('measure');

    nodes.forEach(data => {
      let m = new Measure(data);
      this.measures.push(m);
    });

    this.measures.forEach(m => m.draw(this.pm));
  }

  load(url) {
    this.init();
    this.g.innerHTML = '';
    return new Promise((resolve, reject) => {
      Ut.get(url)
        .then(data => {
          this.parseXML(data);
          resolve();
        });
    });
  }
}
