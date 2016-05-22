import {inject} from 'aurelia-framework';
import {ReservedRowModel} from 'models/rowmodels';

export class ReservedRow {
  constructor () {
    this.row = new ReservedRowModel();
  }

  activate(row) {
    this.row.Id = row.Id;
    this.row.ReservedItem = row.ReservedItem;
    this.row.ReservedCapacity = row.ReservedCapacity;
    this.row.ReservedEntries = row.ReservedEntries;
  }

}
