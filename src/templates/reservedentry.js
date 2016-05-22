import {inject} from 'aurelia-framework';
import {ReservedEntryModel} from 'models/entrymodels';

export class ReservedEntry {
  constructor () {
    this.entry = new ReservedEntryModel();
  }

  activate(entry) {
    this.entry.Wafer = entry.Wafer;
  }

}
