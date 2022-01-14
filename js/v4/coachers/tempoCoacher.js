import {cconst} from '../../common/commonConst.js';
import {SVGBuilder} from '../classes/svgBuilder.js';
import {Settings} from '../../../conf/localSettings.js'
import {Coacher} from './coacher.js'

export class TempoCoacher {
  constructor(app) {
    Coacher.call(this);
    this.app = app;
    this.initListeners();
  }

  init() {
    this.tempo = SVGBuilder.createSVG('g');
    this.tempo.setAttributeNS(null, 'id', 'FragmentCoacher');
    this.app.sheet.secondLayer.append(this.tempo);

    let s = (Settings.range ? Settings.range[0] : 0);
    let e = (Settings.range ? Math.min(Settings.range[1], this.app.cc.items.length - 1) : this.app.cc.items.length - 1);
    this.from = {
      index: s,
      line: this.createLineAt(s, 'from'),
    };
    this.to = {
      index: e,
      line: this.createLineAt(e, 'to'),
    };
  }

  getX(index) {
    return this.app.cc.items[index].x
  }

  calcMeasureTemp(mover) {
    if (mover.curIndex == this.from.index) return;
    let y = mover.cc.items[mover.curIndex];
    let x = mover.cc.items[mover.curIndex - 1];
    let mNumber = x.tp.measure.number;
    if (y.tp.measure.number == mNumber) return;
    let i = mover.curIndex - 1;
    while (mover.cc.items[i]?.tp.measure.number == mNumber && mover.cc.items[i].time) {
      i -= 1;
    }
    i += 1;
    let j = mover.cc.items[i];
    if (!j.time) return;
    let measureBeats = this.tickPerBit * 4 / j.tp.measure.timeSignature['beat-type'];
    let tickLength = (j.tp.measure.timeSignature.beats * measureBeats) - j.tp.tick + y.tp.tick;
    let tempo = Math.round(60000 / (y.time - j.time) * (tickLength / measureBeats));
    let t = SVGBuilder.text({x: x.x, y: 400, text: `tempo: ${tempo}`});
    t.style.fontSize = '38px';
    this.tempo.append(t);
  }

  pushSpendTime() {
    let cc = this.app.mover.cc.items;
    let lastIndex = (this.to.index == this.app.cc.items.length - 1 ? 10000 : this.to.index);
    this.app.stats.addSpendTime({
      name: this.app.sheet.name,
      from: this.from.index,
      to: lastIndex,
      timeLength: cc[this.to.index].time - cc[this.from.index].time,
      dateTime: new Date(),
      errors: this.app.sheet.errors
    });
  }

  initListeners() {
    this.app.mover.addEventListener('onNext', (event) => {
      let tp = event.cc.items[event.curIndex].tp;
      if (event.curIndex > this.to.index) {
        this.pushSpendTime();
        this.setStartFragment();
      }
    });
    this.app.mover.addEventListener('onSheetEnd', (event) => {
      this.pushSpendTime();
      this.setStartFragment();
    })
    this.app.mover.addEventListener('beforeIndexUpdated', (event) => {
      this.calcMeasureTemp(event);
    })
  }

  updatePeaceTime() {
    let cc = this.app.mover.cc;
    let s = cc.items[this.from.index].time;
    let e = cc.items[this.to.index].time;
    if (!s && !e) {
      this.app.ui.temp.innerHTML = `Tempo: -`;
      return;
    }
    this.app.ui.temp.innerHTML = 'Sec: ' + Math.round((e - s) / 1000);
  }

  timeFormat(time) {
    let m = Math.floor(time / 60000);
    let s = Math.round((time - m * 60000) / 1000);
    return `${m} m ${s} сек`;
  }

  updateSheetActivity() {
    let cc = this.app.mover.cc.items;
    let lastIndex = (this.to.index == this.app.cc.items.length - 1 ? 10000 : this.to.index);
    let store = this.app.stats.db.store('SpendTime');
    let nameIndex = store.index('name');
    let allRecords = nameIndex.getAll(this.app.sheet.name);
    allRecords.onsuccess = () => {
      let lasts = allRecords.result
        .filter(e => e.from == this.from.index && e.to == lastIndex)
        .sort((a, b) => b.dateTime - a.dateTime)
        .splice(0, 3);
      this.app.ui.sheetActivity.innerHTML = lasts
        .map(e => `Время: ${this.timeFormat(e.timeLength)}, Ошибок: ${e.errors}`).join('<br>');
    };
  }

  setStartFragment() {
    this.tempo.innerHTML = '';
    this.app.mover.setCurIndex(this.from.index);
    this.app.sheet.errors = 0;
    this.app.mover.dispatchEvent('onErrorNotePressed');
    this.repeat += 1;
    this.updatePeaceTime();
    this.updateSheetActivity();
    this.app.ui.repeats.innerHTML = `Repeat: ${this.repeat}`;
  }

  setLineX(pos) {
    let el = this[pos].line;
    let dx = ('to' == pos ? 25 : -7);
    let x = this.getX(this[pos].index) + dx;
    el.setAttributeNS(null, 'x1', x);
    el.setAttributeNS(null, 'x2', x);
  }

}
