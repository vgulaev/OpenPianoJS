class GrandStaffBody {
  constructor(grandStaff) {
    this.grandStaff = grandStaff;
    this.root = SVGBuilder.createSVG('svg');
    this.height = this.grandStaff.header.height;
    this.width = window.innerWidth - this.grandStaff.header.root.width.baseVal.value - 20;
    this.root.setAttributeNS(null, 'height', this.height);
    this.root.setAttributeNS(null, 'width', this.width);

    this.drawStaffLine();

    this.grandStaff.root.append(this.root);
  }

  drawStaffLine() {
    [84, 242].forEach( lvl => {
      for (let y = lvl; y <= lvl + 15 * 4; y += 15) {
        this.root.append(SVGBuilder.line({x1: 0, y1: y, x2: this.width, y2: y, 'stroke-width': 2, stroke: 'black'}));
      }
    });
  }
}
