import {Component} from 'angular2/core';
import {RouterLink} from 'angular2/router';

@Component({
  directives: [RouterLink],
  pipes: [],
  providers: [],
  selector: 'home',
  template: require('./home.html')
})
export class Home {
  constructor() {
    console.debug('Home constructor.');
  }

  public reload() {
    location.reload();
  }
}
