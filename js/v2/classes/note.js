class Note {
  constructor(xml) {
    this.xml = xml;
    this.parseChildren(this, xml);
  }

  parseChildren(o, xml) {
    for (let c of xml.children) {
      if (0 == c.childElementCount) {
        if ('' == c.innerHTML) {
          o[c.tagName] = true
        } else {
          let i = parseInt(c.innerHTML);
          if (isNaN(i)) {
            o[c.tagName] = c.innerHTML;
          } else {
            o[c.tagName] = i;
          }
        }
      } else {
        o[c.tagName] = {};
        this.parseChildren(o[c.tagName], c);
      }
    }
  }


  toString() {
    if (this.rest) return 'rest'
    // let step = this.xml.querySelector('step').innerHTML;
    // let alter = this.xml.querySelector('alter');
    // let octave = this.xml.querySelector('octave').innerHTML;

    return this.pitch.step.toString() + this.pitch.octave.toString();
  }
}
