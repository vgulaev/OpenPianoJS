class Sheet {
  constructor(grandStaff) {
    this.grandStaff = grandStaff;
    this.use = SVGBuilder.createSVG('use');
    this.createRenderRoot();

    this.tm = new TimeMachine(this);
    this.pm = new PrintMachine(this.g, this.tm);
  }

  load(url) {
    return new Promise((resolve, reject) => {
      Ut.get(url, true)
        .then((data) => {
          this.loadFromStr(data);
          resolve();
        });
    });
  }

  loadFromXML(xml) {
    this.xml = xml;

    this.measures = xml.querySelectorAll('measure');
    let timeMachine = this.timeMachine;

    let tags = new Set();
    let parsedTags = new Set(['key', 'fifths', 'time', 'clef', 'note', 'backup', 'forward']);
    this.measures.forEach((m, i) => {
      let measure = new Measure(m);
      this.pm.draw(measure);
      Ut.iterateChildren(m, node => {
        if (parsedTags.has(node.tagName)) {
          this.tm.push(node);
        }
      });
      this.pm.drawTimePoints();
    });
    console.log(this.tm.arrowOfTime);

    this.render();
    this.setStartPoint();
  }

  loadFromStr(data) {
    var p = new DOMParser();
    var xml = p.parseFromString(data, 'text/xml');
    this.loadFromXML(xml);
  }

  setStartPoint() {
    this.use.setAttributeNS(null, "x", 200);
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

  render() {
    // for (let i = 0; i < 10; i++) {
    //   let t = SVGBuilder.emmentaler({x: 10 + i * 20, y: cconst['staff'][1]['yDown'] - i * 7.5, text: emm.Notehead['s2']});
    //   this.g.append(t);
    // }
  }
}
