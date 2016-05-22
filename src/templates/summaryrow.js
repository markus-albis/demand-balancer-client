import {inject} from 'aurelia-framework';
import {SummaryRowModel} from 'models/rowmodels';

export class SummaryRow {
  constructor () {
    this.row = new SummaryRowModel();
  }

  activate(row) {
    this.row.SummaryItemId = row.SummaryItemId;
    this.row.Description = row.Description;
    this.row.Rule = row.Rule;
    this.row.Limit = row.Limit;
    this.row.SummaryEntries = row.SummaryEntries;
  }

}
