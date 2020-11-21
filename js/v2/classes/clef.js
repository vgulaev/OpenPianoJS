class Clef {
  constructor(xml) {
    this.number = xml.getAttribute('number');
    this.sign = xml.querySelector('sign').innerHTML;
    this.change = Ut.innerHTML(xml, 'clef-octave-change');
    if (null == this.change) this.change = 0;
  }

  toS() {
    return this.sign + this.change;
  }
}
