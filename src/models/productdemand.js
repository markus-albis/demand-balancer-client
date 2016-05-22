import {computedFrom} from 'aurelia-framework';

export class ProductDemandEntry {

  _die = 0;
  _diePerWafer = 1;

  constructor() {

  }

  get DiePerWafer(){
    return this._diePerWafer;
  }
  set DiePerWafer(value) {
    this._diePerWafer = value;
    return;
  }

  get Die() {
    return this._die;
  }
  set Die(value) {
    this._die = value;
    return;
  }

 @computedFrom('Die')
  get Wafer() {
    return this.Die/this.DiePerWafer;
  }

}
