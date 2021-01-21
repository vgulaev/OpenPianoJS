export class UI {
  constructor() {
    this.UIHeader = document.getElementById('Header');
    this.createSheetList();
  }

  createSheetList() {
    let e = document.createElement('input');
    e.setAttribute('id', 'SheetList');
    this.UIHeader.append(e);
  }
}
