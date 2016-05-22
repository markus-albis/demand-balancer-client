import {inject} from 'aurelia-framework';
import {computedFrom} from 'aurelia-framework';
import {DBDataService} from 'services/dbdataservice';
import {_} from 'underscore';
import {ProductDemandEntry} from 'models/productdemand';
import {RCDemandEntry} from 'models/rcdemand';
import {SummaryEntry} from 'models/summaryentry'

import $ from "jquery";

@inject(DBDataService)
export class Balancer {

 viewport = [];
 mdemand = [];
 rdemand = [];

 productDemand = [];
 rcDemand = [];
 products = [];
 rcItems = [];

 anItems = [];
 currentYear = 16;
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
    Promise.all([op1,op2,op3,op4])
      .then(results => {
        this.products=results[0];
        this.productDemand=results[1];
        this.rcItems=results[2];
        this.rcDemand=results[3];
        this.loadANItems();

        for (let w of this.viewport) {
          let md = [];
          // Loop to get the MTO demand for each product
          for (let p of this.products) {
            let pdbyWaP = this.dataservice.getProductDemandbyWeekAndProductfromCache(w,p.ProductId);  //Check if there is an entry for the week and the product in ProductDemand
            if (pdbyWaP.length === 0)  {
              let d = new ProductDemandEntry();
              d.Die = 0;
              d.DiePerWafer = p.DiePerWafer;
              md.push(d);
            }
            else {
              let d = new ProductDemandEntry();
              d.Die = pdbyWaP[0].Demand;
              d.DiePerWafer = p.DiePerWafer;
              md.push(d);
            }
          } // end loop (products)
          this.mdemand.push(md);

          let rd = [];
          // Loop to get the RC demand for each item
          for (let r of this.rcItems) {
            let rdbyWaI = this.dataservice.getRCDemandbyWeekAndItemfromCache(w,r.RCItemId);  //Check if there is an entry for the week and the item in RCDemand
            if (rdbyWaI.length === 0)  {
              let d = new RCDemandEntry();
              d.Wafer = 0;
              rd.push(d);
            }
            else {
              let d = new RCDemandEntry();
              d.Wafer = rdbyWaI[0].Demand;
              rd.push(d);
            }
          } // end loop (rcItems)
          this.rdemand.push(rd);
        } // end loop (viewport)
      });
  }


  get compound() {
    return  this.recalculate();
  }


  recalculate() {
    let summary = [];

    for (let w = 0; w < this.viewport.length; w++) {
      let ws = [];
      let mtoWeekTotal = 0;
      let rcWeekTotal = 0;
      let weekTotal = 0;
      let total = 0;          // To calculate four week total we need to loop three weeks before viewport's firstWeek (extended viewport)
      // Recalculate mtoWeekTotal'

      let md = this.mdemand[w];
      for (let m of md) {mtoWeekTotal = mtoWeekTotal += m.Wafer};
      let mt = new SummaryEntry ;
      mt.Wafer=  mtoWeekTotal;
      ws.push(mt);
      // Recalculate rcWeekTotal'
      let rd = this.rdemand[w];
      for (let r of rd) {rcWeekTotal = rcWeekTotal += r.Wafer};
      let rt = new SummaryEntry
      rt.Wafer = rcWeekTotal;
      ws.push(rt);
      // Calculate weekTotal
      weekTotal = mtoWeekTotal + rcWeekTotal;
      let wt = new SummaryEntry
      wt.Wafer= weekTotal;
      ws.push(wt);
      // Calculate four weekTotal
      total = mtoWeekTotal + rcWeekTotal;
      let fwt = new SummaryEntry;
      fwt.Wafer = total;
      ws.push(fwt);
      summary.push(ws);
    }
    return summary;
  }


  mEntryChanged() {
    console.log("MTO entry changed");
    this.recalculate();
  }

  rEntryChanged() {
    console.log("RC entry changed");
    this.recalculate();
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


  loadANItems() {
    let an1 = {
      "id": 1,
      "target": "MTO Week Total",
    };
    let an2 = {
      "id": 2,
      "target": "RC Week Total",
    };
  let an3 =  {
      "id": 3,
      "target": "Week Total (< 5)",
    };
    let an4 = {
      "id": 4,
      "target": "4 Week Total (<16)",
    };

    this.anItems.push(an1);
    this.anItems.push(an2);
    this.anItems.push(an3);
    this.anItems.push(an4);
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
