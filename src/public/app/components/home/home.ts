import _ = require('lodash');
import {Component} from 'angular2/core';
import {RouteParams, Router, RouterLink} from 'angular2/router';
import {ModalService} from '../../shared/services/modalService';
import {UserService} from '../../shared/services/userService';

@Component({
  directives: [RouterLink],
  pipes: [],
  providers: [],
  selector: 'home',
  template: require('./home.html')
})
export class Home {
  constructor(private _params: RouteParams, private _router: Router, private _userService: UserService) {
    console.debug('Home constructor.');
    // TODO: Global interceptor for access-code
    let accessCode: any = _.get(this, '_params.params.access-code');
    if (accessCode) {
      this._userService.signinAccessCode(accessCode);
      this._router.navigate(['Home']);
    }
  }

  public reload() {
    location.reload();
  }
}
