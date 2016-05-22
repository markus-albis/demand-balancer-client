import {computedFrom} from 'aurelia-framework';
export class SummaryEntry {

  _wafer = 0;

  constructor() {

  }

  get Wafer() {
    return this._wafer;
  }
  set Wafer(value) {
    this._wafer = value;
    return;
  }


}
