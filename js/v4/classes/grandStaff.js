import {GrandStaffHeader} from './grandStaffHeader.js';
import {GrandStaffBody} from './grandStaffBody.js';

export class GrandStaff {
  constructor(app) {
    this.app = app;
    this.root = document.getElementById('GrandStaff');
    this.header = new GrandStaffHeader(this);
    this.body = new GrandStaffBody(this);
  }
}
