import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {FORM_PROVIDERS} from 'angular2/common';
import {Home} from './components/home/home';

@Component({
  directives: [ROUTER_DIRECTIVES],
  pipes: [],
  providers: [FORM_PROVIDERS],
  selector: 'app',
  template: `
    <header>
    </header>
    <main class="container">
      <router-outlet></router-outlet>
    </main>
  `
})
@RouteConfig([
  {component: Home, name: 'Home', path: '/'}
])
export class App {
  constructor() {
    console.debug('App constructor.');
  }
}
