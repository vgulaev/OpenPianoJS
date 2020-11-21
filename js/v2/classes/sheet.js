class Sheet {
  constructor(grandStaff) {
    this.grandStaff = grandStaff;
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

    this.grandStaff.header.setKeySignature(this.keyFifths);
    this.grandStaff.header.setTimeSignature(this.beats, this.beatType);
  }

  loadFromXML(xml) {
    this.xml = xml;
    this.setAttr();

    let measure = xml.getElementsByTagName('measure');
    let timeMachine = new TimeMachine(this.divisions);

    let k = 0;
    for (let m of measure) {
      let beats = m.querySelector('beats');
      if (null != beats) {
        timeMachine.beats = parseInt(beats.innerHTML);
      }
      timeMachine.tick = 0;
      for (let childNode of m.children) {
        if (-1 != ['note', 'backup', 'forward'].indexOf(childNode.tagName))
          timeMachine.push(childNode);
      }
      timeMachine.tickOffset += timeMachine.beats * this.divisions;
    }
    console.log('childNode.tagName');
  }

  loadFromStr(data) {
    var p = new DOMParser();
    var xml = p.parseFromString(data, 'text/xml');
    this.loadFromXML(xml);
  }
}
