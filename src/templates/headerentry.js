import {inject} from 'aurelia-framework';
import {HeaderEntryModel} from 'models/entrymodels';

export class HeaderEntry {
  constructor () {
    this.entry = new HeaderEntryModel();
  }

  activate(entry) {
    this.entry.ColumnTitel1 = entry.ColumnTitel1;
    this.entry.ColumnTitel2 = entry.ColumnTitel2;
  }

}
