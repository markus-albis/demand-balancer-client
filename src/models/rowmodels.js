export class ProductRowModel {

  constructor(id,pc,dpw,entries, ish) {
    this.Id = id;
    this.ProductCode = pc;
    this.DiePerWafer = dpw;
    this.ProductEntries = entries ? entries : [];
  }

}

export class ReservedRowModel {

  constructor(id,rci,rcc, entries, ish) {
    this.Id = id;
    this.ReservedItem = rci;
    this.ReservedCapacity = rcc;
    this.ReservedEntries = entries ? entries : [];
  }

}

export class SummaryRowModel {

  constructor(id,des,rule,entries,ish) {
    this.SummaryItemId = id;
    this.Description = des;
    this.Rule = rule;
    this.SummaryEntries = entries ? entries : [];
  }

}

export class HeaderRowModel {

  constructor(ct1,ct2,ct3,entries) {
    this.ColumnTitel1 = ct1;
    this.ColumnTitel2 = ct2;
    this.ColumnTitel3 = ct3;
    this.HeaderEntries = entries ? entries : [];
  }

}
