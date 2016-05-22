import {inject} from 'aurelia-framework';
import breeze from 'breeze';
import settings from '../settings';


export class DBDataService {

  dbDataService = settings.dbDataService;
  manager = new breeze.EntityManager(this.dbDataService);

  constructor() {

  }

  getProducts() {
    var query = breeze.EntityQuery.from("Products");
    return this.manager.executeQuery(query);
  }

  getProductDemand() {
    var query = breeze.EntityQuery.from("ProductDemands");
    return this.manager.executeQuery(query);
  }

  getRCItems() {
    var query = breeze.EntityQuery.from("RCItems");
    return this.manager.executeQuery(query);
  }

  getRCDemand() {
    var query = breeze.EntityQuery.from("RCDemands");
    return this.manager.executeQuery(query);
  }

  getSummaryItems() {
    var query = breeze.EntityQuery.from("SummaryItems");
    return this.manager.executeQuery(query);
  }

  getProductDemandbyWeekAndProductfromCache(week, pid) {
    var baseQuery = breeze.EntityQuery.from("ProductDemands");
    let p1 = new breeze.Predicate('WeekId', '==', week);
    let p2 = new breeze.Predicate('ProductId', '==', pid);
    let query=baseQuery.where(p1.and(p2));
    return this.manager.executeQueryLocally(query);
  }

  getRCDemandbyWeekAndItemfromCache(week, rid) {
    var baseQuery = breeze.EntityQuery.from("RCDemands");
    let p1 = new breeze.Predicate('WeekId', '==', week);
    let p2 = new breeze.Predicate('RCItemId', '==', rid);
    let query=baseQuery.where(p1.and(p2));
    return this.manager.executeQueryLocally(query);
  }

}
