import {Ut} from './ut.js';

export class Sheet {
  parseXML(data) {
    var p = new DOMParser();
    var xml = p.parseFromString(data, 'text/xml');
  }

  load(url) {
    Ut.get(url)
      .then(data => {
        this.parseXML(data);
      });
  }
}
