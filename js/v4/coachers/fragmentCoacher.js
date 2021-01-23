import {cconst} from '../../common/commonConst.js';
import {SVGBuilder} from '../classes/svgBuilder.js';
import {Settings} from '../../../conf/localSettings.js'

export class FragmentCoacher {
  constructor(app) {
    this.app = app;
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
    this.initListeners();
    this.setStartFragment();
    this.addButtons();
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

  initListeners() {
    this.app.mover.addEventListener('onNext', (event) => {
      if (event.curIndex > this.to.index) {
        this.setStartFragment();
      }
    });
    this.app.mover.addEventListener('onSheetEnd', (event) => {
      this.setStartFragment();
    })
  }

  setStartFragment() {
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
    app.ui.UIHeader.append(startButton);

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
    app.ui.UIHeader.append(endButton);
  }
}
