export class App {
  configureRouter(config, router) {

    config.title = 'Capacity-Demand Balancer';

    config.map([
      { name: ['', 'home'], route: '', redirect: 'about/about' },
      { route: 'balancer',  name: 'balancer', moduleId: 'balancer/balancer', nav: true, title: 'Balancer' },
      { route: 'balancer2',  name: 'balancer2', moduleId: 'balancer2/balancer2', nav: true, title: 'Balancer2' },
      { route: ['', 'about'], name: 'about',moduleId: 'about/about',nav: true, title: 'About' }
    ]);

    this.router = router;
  }
}
