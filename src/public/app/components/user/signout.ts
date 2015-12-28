import {Component} from 'angular2/core';
import {UserService} from '../../shared/services/userService';


@Component({
  directives: [],
  pipes: [],
  providers: [],
  selector: 'signout',
  template: require('./signout.html')
})
export class UserSignout {

  constructor(private userService: UserService) {
    console.debug('UserSignout constructor.');
    this.userService.signout();
  }

}
