class Beats {
  constructor(xml) {
    this.xml = xml;
    Ut.parseChildren(this, xml);
  }
}
