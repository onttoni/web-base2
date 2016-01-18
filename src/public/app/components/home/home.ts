import {Component} from 'angular2/core';
import {RouterLink} from 'angular2/router';
import {ModalService} from '../../shared/services/modalService';

@Component({
  directives: [RouterLink],
  pipes: [],
  providers: [],
  selector: 'home',
  template: require('./home.html')
})
export class Home {
  constructor(private _modalService: ModalService) {
    console.debug('Home constructor.');
  }

  public reload() {
    location.reload();
  }
}
