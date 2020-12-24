import {GrandStaffHeader} from './grandStaffHeader.js';

export class GrandStaff {
  constructor() {
    this.root = document.getElementById('GrandStaff');
    this.header = new GrandStaffHeader(this);
    // this.body = new GrandStaffBody(this);
  }
}
