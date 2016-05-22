export class ProductEntryModel {

  _die = 0;
  _diePerWafer = 1;

  constructor(d, dpw) {
    this.DieperWafer = dpw;
    this.Die = d;
    this.Wafer = d/dpw;
  }

}

export class ReservedEntryModel {

  constructor(w) {
    this.Wafer = w;
  }

}

export class SummaryEntryModel {

  constructor(w) {
    this.Wafer = w;
  }

}

export class HeaderEntryModel {

  constructor(ct1,ct2) {
    this.ColumnTitel1 = ct1;
    this.ColumnTitel2 = ct2;
  }

}
