import {inject} from 'aurelia-framework';
import {HeaderRowModel} from 'models/rowmodels';

export class HeaderRow {
  constructor () {
    this.row = new HeaderRowModel();
  }

  activate(row) {
    this.row.ColumnTitel1 = row.ColumnTitel1;
    this.row.ColumnTitel2 = row.ColumnTitel2;
    this.row.ColumnTitel3 = row.ColumnTitel3;
    this.row.HeaderEntries = row.HeaderEntries;
  }

}
