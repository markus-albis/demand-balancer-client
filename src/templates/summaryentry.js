import {inject} from 'aurelia-framework';
import {SummaryEntryModel} from 'models/entrymodels';

export class SummaryEntry {
  constructor () {
    this.entry = new SummaryEntryModel();
  }

  activate(entry) {
    this.entry.Wafer = entry.Wafer;
  }

}
