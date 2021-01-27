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
    this.pm = new PrintMachine(this.g);
  }

  createRenderRoot() {
    this.g = SVGBuilder.createSVG('g');
    this.g.setAttributeNS(null, 'id', 'SheetMusic');
    this.grandStaff.body.root.append(this.g);
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
