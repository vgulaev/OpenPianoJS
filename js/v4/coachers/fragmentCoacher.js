import {cconst} from '../../common/commonConst.js';
import {SVGBuilder} from '../classes/svgBuilder.js';
import {Settings} from '../../../conf/localSettings.js'

export class FragmentCoacher {
  constructor(app) {
    this.app = app;
    this.initListeners();
    this.addButtons();
  }

  init() {
    this.tempo = SVGBuilder.createSVG('g');
    this.tempo.setAttributeNS(null, 'id', 'FragmentCoacher');
    this.app.sheet.secondLayer.append(this.tempo);
    let s = (Settings.range ? Settings.range[0] : 0);
    let e = (Settings.range ? Settings.range[1] : this.app.cc.items.length - 1);
    this.from = {
      index: s,
      line: this.createLineAt(s, 'from'),
    };
    this.to = {
      index: e,
      line: this.createLineAt(e, 'to'),
    };
    this.setStartFragment();
    this.tickPerBit = this.app.sheet.measures[0].tickPerBit;
  }

  getX(index) {
    return this.app.cc.items[index].x
  }

  createLineAt(index, pos) {
    let dx = ('to' == pos ? 25 : -7);
    let x = this.getX(index) + dx;
    let l = SVGBuilder.line({x1: x, y1: 84, x2: x, y2: 302, 'stroke-width': 4, stroke: 'green'});
    this.app.sheet.g.append(l);
    return l;
  }

  calcMeasureTemp(mover) {
    if (mover.curIndex == this.from.index) return;
    let y = mover.cc.items[mover.curIndex];
    let x = mover.cc.items[mover.curIndex - 1];
    let mNumber = x.tp.measure.number;
    if (y.tp.measure.number == mNumber) return;
    let i = mover.curIndex - 1;
    while (mover.cc.items[i]?.tp.measure.number == mNumber && mover.cc.items[i].time) {
      // console.log('calcMeasureTemp', i)
      i -= 1;
    }
    i += 1;
    let j = mover.cc.items[i];
    if (!j.time) return;
    let tickLength = (j.tp.measure.timeSignature.beats * this.tickPerBit) - j.tp.tick + y.tp.tick;
    // let tempo = Math.floor((60000 / (y.time - j.time) * (tickLength / this.tickPerBit));
    let tempo = Math.floor(60000 / (y.time - j.time) * (tickLength / this.tickPerBit));
    let t = SVGBuilder.text({x: x.x, y: 400, text: `tempo: ${tempo}`});
    t.style.fontSize = '38px';
    this.tempo.append(t);
    // console.log('calcMeasureTemp', i, tickLength, tempo);
  }

  initListeners() {
    this.app.mover.addEventListener('onNext', (event) => {
      let tp = event.cc.items[event.curIndex].tp;
      if (event.curIndex > this.to.index) {
        this.setStartFragment();
      }
    });
    this.app.mover.addEventListener('onSheetEnd', (event) => {
      this.setStartFragment();
    })
    this.app.mover.addEventListener('beforeIndexUpdated', (event) => {
      this.calcMeasureTemp(event);
    })
  }

  setStartFragment() {
    this.tempo.innerHTML = '';
    this.app.mover.setCurIndex(this.from.index);
  }

  setLineX(pos) {
    let el = this[pos].line;
    let dx = ('to' == pos ? 25 : -7);
    let x = this.getX(this[pos].index) + dx;
    el.setAttributeNS(null, 'x1', x);
    el.setAttributeNS(null, 'x2', x);
  }

  addButtons() {
    let startButton = document.createElement('button');
    startButton.innerHTML = 'Начало фрагмента';
    startButton.addEventListener('click', () => {
      if ('Начало фрагмента' == startButton.innerHTML) {
        this.from.index = this.app.mover.curIndex;
        startButton.innerHTML = 'С начала';
      } else {
        this.from.index = 0;
        startButton.innerHTML = 'Начало фрагмента';
      }
      this.setLineX('from');
    });
    this.app.ui.UIHeader.append(startButton);

    let endButton = document.createElement('button');
    endButton.innerHTML = 'Конец фрагмента';
    endButton.addEventListener('click', () => {
      if ('Конец фрагмента' == endButton.innerHTML) {
        this.to.index = this.app.mover.curIndex;
        this.setLineX('to');
        this.setStartFragment();
        endButton.innerHTML = 'До конца';
      } else {
        this.to.index = this.app.cc.items.length - 1;
        this.setLineX('to');
        endButton.innerHTML = 'Конец фрагмента';
      }
    });
    this.app.ui.UIHeader.append(endButton);
  }
}
