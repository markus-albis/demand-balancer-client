import {inject} from 'aurelia-framework';
import {DBDataService} from 'services/dbdataservice';
import {_} from 'underscore';
import {ProductRowModel,ReservedRowModel, SummaryRowModel, HeaderRowModel} from 'models/rowmodels';
import {ProductEntryModel, ReservedEntryModel, SummaryEntryModel, HeaderEntryModel} from 'models/entrymodels';

import $ from "jquery";

@inject(DBDataService)
export class Balancer2 {

  firstWeek = 0;
  lastWeek = 0;
  span = 12;


  constructor(dataService) {
    this.dataservice = dataService;
    this.firstWeek = this.getFirstWeek(new Date());
    this.lastWeek = this.getLastWeek(this.firstWeek, this.span);
    console.log("Weeks:", this.firstWeek, this.lastWeek);
  }

attached() {
  this.viewport = this.setViewPort(this.firstWeek, this.span);
  let op1 = Promise.resolve(this.getProducts());
  let op2 = Promise.resolve(this.getProductDemand());   //To do:  Get ProductDemand only for selected viewport
  let op3 = Promise.resolve(this.getRCItems());
  let op4 = Promise.resolve(this.getRCDemand());
  let op5 = Promise.resolve(this.getSummaryItems());
  Promise.all([op1,op2,op3,op4,op5])
    .then(results => {
      this.products=results[0];
      this.productDemand=results[1];
      this.rcItems=results[2];
      this.rcDemand=results[3];
      this.summaryItems=results[4];
      console.log(this.summaryItems)

      this.ProductHeaderRows = this.getProductHeaderRow();
      this.ProductRows = this.getProductRows();

      this.ReservedHeaderRows = this.getReservedHeaderRow();
      this.ReservedRows = this.getReservedRows();

      this.SummaryHeaderRows = this.getSummaryHeaderRow();
      this.SummaryRows = this.getSummaryRows();

    });
}

  getProductHeaderRow() {
    let phrs = [];
    let phr = new HeaderRowModel("Make to Order","D/W", "")
      for (let w of this.viewport) {
        let phe = new HeaderEntryModel("D","W");
        phr.HeaderEntries.push(phe);
      }
      phrs.push(phr);
      return phrs;
  }

  getProductRows() {
    let prs = [];
      for (let p of this.products) {
        let pr = new ProductRowModel(p.ProductId,p.ProductCode,p.DiePerWafer)
        for (let w of this.viewport) {
          let pdbyWaP = this.dataservice.getProductDemandbyWeekAndProductfromCache(w,p.ProductId);  //Check if there is an entry for the week and the product in ProductDemand
          if (pdbyWaP.length === 0)  {
            let pem = new ProductEntryModel(0,p.DiePerWafer);
            pr.ProductEntries.push(pem);
          }
          else {
            let pem = new ProductEntryModel(pdbyWaP[0].Demand,p.DiePerWafer);
            pr.ProductEntries.push(pem);
          }
      } // end loop (weeks)
      prs.push(pr);
  } // end loop (products)
    return prs;
  }

  getReservedHeaderRow() {
    let rhrs = [];
    let rhr = new HeaderRowModel("Reserved Capacity","C/Week", "")
      for (let w of this.viewport) {
        let rhe = new HeaderEntryModel("","W");
        rhr.HeaderEntries.push(rhe);
      }
      rhrs.push(rhr);
      return rhrs;
  }

  getReservedRows() {
    let rrs = [];
      for (let r of this.rcItems) {
        let rr = new ReservedRowModel(r.RCItemId, r.Description, r.Capacity)
        for (let w of this.viewport) {
          let rdbyWaI = this.dataservice.getRCDemandbyWeekAndItemfromCache(w,r.RCItemId);  //Check if there is an entry for the week and the rcItem in RCDemand
          if (rdbyWaI.length === 0)  {
            let rem = new ReservedEntryModel(r.Wafer);
            rr.ReservedEntries.push(rem);
          }
          else {
            let rem = new ReservedEntryModel(rdbyWaI[0].Wafer,);
            rr.ReservedEntries.push(rem);
          }
      } // end loop (weeks)
      rrs.push(rr);
  } // end loop (reserved)
    return rrs;
  }

  getSummaryHeaderRow() {
    let shrs = [];
    let shr = new HeaderRowModel("Analysis","Rule","")
      for (let w of this.viewport) {
        let she = new HeaderEntryModel("","W");
        shr.HeaderEntries.push(she);
      }
      shrs.push(shr);
      return shrs;
  }

  getSummaryRows() {
    let srs = [];
      for (let s of this.summaryItems) {
        let sr = new SummaryRowModel(s.SummaryItemId, s.Description, s.Rule)
        for (let w of this.viewport) {
            let sem = new SummaryEntryModel(0);
            sr.SummaryEntries.push(sem);
      } // end loop (weeks)
      srs.push(sr);
  } // end loop (summaries)
    return srs;
  }


  getProducts() {
    return this.dataservice.getProducts()
      .then(result => {
      return result.results;
      });
  }

  getProductDemand() {
  return this.dataservice.getProductDemand()
      .then(result => {
      return result.results;
      });
  }

  getRCDemand() {
  return this.dataservice.getRCDemand()
      .then(result => {
      return result.results;
      });
  }

  getRCItems() {
  return this.dataservice.getRCItems()
      .then(result => {
      return result.results;
      });
  }

  getSummaryItems() {
  return this.dataservice.getSummaryItems()
      .then(result => {
      return result.results;
      });
  }

  setViewPort(first, span) {
    let ws =[];
    let week = first % 100;
    for (let i = 0; i<span; i++) {
      if ((week + i) > 52) {
        let year = 1 + (first-first % 100)/100;
        let newWeek = week + span - 52;
        ws.push(100*year + newWeek);
      }
      else {
        ws.push(first + i);
      }
    }
    return ws;
  }


  getFirstWeek(date) {
    let year = date.getFullYear() - 2000;
    let first = 100*year + this.getWeek(date);
    return first;
  }

  getLastWeek(firstWeek, span) {
    let week = firstWeek % 100;
    if ((week + span) > 52) {
      let year = 1 + (firstWeek-firstWeek % 100)/100;
      let newWeek = week + span - 52;
      return 100*year + newWeek;
    }
    else {
      return firstWeek + span;
    }
    let year = (firstWeek-firstWeek % 100)/100;
    console.log(year);
  }

  getWeek(date) {
   date.setHours(0, 0, 0, 0);
   // Thursday in current week decides the year.
   date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
   // January 4 is always in week 1.
   var week1 = new Date(date.getFullYear(), 0, 4);
   // Adjust to Thursday in week 1 and count number of weeks from date to week1.
   return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
 }

}
