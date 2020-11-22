class Sheet {
  constructor(grandStaff) {
    this.grandStaff = grandStaff;
    this.bars = [];
  }

  async load(url) {
    Ut.get(url, true)
      .then((data) => {
        this.loadFromStr(data);
      });
  }

  setAttr() {
    let attr = this.xml.querySelector('attributes');
    this.keyFifths = parseInt(attr.querySelector('fifths').innerHTML);
    this.divisions = parseInt(attr.querySelector('divisions').innerHTML);
    this.beats = parseInt(attr.querySelector('beats').innerHTML);
    this.beatType = parseInt(attr.querySelector('beat-type').innerHTML);

    attr.querySelectorAll('clef').forEach(c => {
      this.grandStaff.header.setClef(new Clef(c));
    });
    this.grandStaff.header.setKeySignature(this.keyFifths);
    this.grandStaff.header.setTimeSignature(this.beats, this.beatType);
  }

  loadFromXML(xml) {
    this.xml = xml;
    this.setAttr();

    this.measures = xml.querySelectorAll('measure');
    let timeMachine = new TimeMachine(this.divisions);

    let k = 0;
    for (let m of this.measures) {
      let beats = m.querySelector('beats');
      let bar = new Measure(m);
      // if (null == bar.keyFifths) {
      //   bar.keyFifths = this.bars[this.bars.length - 1].keyFifths;
      // }
      this.bars.push(bar);
      if (null != beats) {
        timeMachine.beats = parseInt(beats.innerHTML);
      }
      bar.from = timeMachine.tickOffset * 10;
      timeMachine.tick = 0;
      for (let childNode of m.children) {
        if (-1 != ['note', 'backup', 'forward'].indexOf(childNode.tagName))
          timeMachine.push(childNode, bar);
      }
      timeMachine.tickOffset += timeMachine.beats * this.divisions;
      bar.to = timeMachine.tickOffset * 10;
    }
    this.timeMachine = timeMachine;
    this.render();
  }

  createRenderRoot() {
    let def = SVGBuilder.createSVG('def');
    this.g = SVGBuilder.createSVG('g');
    this.g.setAttributeNS(null, 'id', 'SheetMusic');
    def.append(this.g);

    this.use = SVGBuilder.createSVG('use');
    this.use.setAttributeNS(null, "x", 450);
    this.use.setAttributeNS(null, "x", 10);
    this.use.setAttributeNS(null, "href", "#SheetMusic");

    this.grandStaff.body.root.append(def);
    this.grandStaff.body.root.append(this.use);
  }

  itterateAndRender(xml) {
    for (let c of xml.children) {
      this.pM.startPrint(c);
      if (c.childElementCount > 0)
        this.itterateAndRender(c);
      this.pM.finishPrint(c);
    }
  }

  render() {
    this.createRenderRoot();
    this.pM = new PrintMachine(this);
    Object.entries(this.timeMachine.arrowOfTime).forEach( e => this.g.append(e[1].g) );
    this.itterateAndRender(this.xml);
  }

  loadFromStr(data) {
    var p = new DOMParser();
    var xml = p.parseFromString(data, 'text/xml');
    this.loadFromXML(xml);
  }
}
