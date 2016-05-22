import {inject} from 'aurelia-framework';
import {ProductRowModel} from 'models/rowmodels';

export class ProductRow {
  constructor () {
    this.row = new ProductRowModel();
  }

  activate(row) {
    this.row.Id = row.Id;
    this.row.ProductCode = row.ProductCode;
    this.row.DiePerWafer = row.DiePerWafer;
    this.row.ProductEntries = row.ProductEntries;
  }

}
