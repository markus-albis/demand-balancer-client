import {inject} from 'aurelia-framework';
import {ProductEntryModel} from 'models/entrymodels';

export class ProductEntry {
  constructor () {
    this.entry = new ProductEntryModel();
  }

  activate(entry) {
    this.entry.DiePerwafer = entry.DiePerWafer;
    this.entry.Die = entry.Die;
    this.entry.Wafer = entry.Wafer;
  }

}
