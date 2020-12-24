import {Ut} from './ut.js';
import {Measure} from './xml/measure.js'
import {SVGBuilder} from './svgBuilder.js';
import {PrintMachine} from './printMachine.js'

export class Sheet {
  constructor(app) {
    this.app = app;
    this.grandStaff = app.grandStaff;
    this.measures = [];
    this.items = [];
    this.use = SVGBuilder.createSVG('use');
    this.createRenderRoot();
    this.pm = new PrintMachine(this.g);
  }

  createRenderRoot() {
    let def = SVGBuilder.createSVG('def');
    this.g = SVGBuilder.createSVG('g');
    this.g.setAttributeNS(null, 'id', 'SheetMusic');
    def.append(this.g);

    this.use.setAttributeNS(null, "href", "#SheetMusic");

    this.grandStaff.body.root.append(def);
    this.grandStaff.body.root.append(this.use);
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
    return new Promise((resolve, reject) => {
      Ut.get(url)
        .then(data => {
          this.parseXML(data);
          resolve();
        });
    });
  }
}
