import {SVGBuilder} from './svgBuilder.js';

export class TempoMaster {
  startMetronome() {
    var e = SVGBuilder.createSVG("polygon");
    e.setAttributeNS(null, "points", "0,0 0,20 20,20 20,0")
    e.setAttributeNS(null, "stroke", "blue");
    e.setAttributeNS(null, "fill", "blue");
    e.setAttributeNS(null, "opacity", "0.5");


    // let count = 0;
    // let e = SVGBuilder.text({text: 'h: 1 q: 3 e: 4', x: 380, y: 50})
    // // let e = SVGBuilder.createSVG('animate');
    // // e.setAttributeNS(null, 'attributeName', 'points');
    // // e.setAttributeNS(null, 'from', '380,54 400,54 400,332 380,332');
    // // e.setAttributeNS(null, 'to', '380,193 400,193 400,193 380,193');
    // // e.setAttributeNS(null, 'dur', '1s');
    // // e.setAttributeNS(null, 'repeatCount', 'indefinite');
    // this.mt = e;
    this.app.grandStaff.body.root.append(e);
    // setInterval(() => {
    //   // console.log('Hello!!!')
    //   count += 1;
    //   this.mt.innerHTML = `h: ${Math.floor(count/8)} q: ${Math.floor(count/4) % 4} e: ${count % 8}`;
    // }, 250)
  }

  constructor(app) {
    this.app = app;
    this.rubicon = app.grandStaff.body.rubicon;
    // console.log('app', app);
    // console.log('app', app.grandStaff.body.rubicon);
    this.startMetronome();
  }

  tick(c) {
    // console.log('TempoMaster ticked', c);
  }
}
