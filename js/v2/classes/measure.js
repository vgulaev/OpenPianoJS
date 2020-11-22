class Measure {
  constructor(xml) {
    this.number = xml.getAttribute('number');
    this.fifths = Ut.parseInt(xml, 'fifths');
    this.beats = Ut.parseInt(xml, 'beats');
    this.beatType = Ut.parseInt(xml, 'beat-type');
  }
}
