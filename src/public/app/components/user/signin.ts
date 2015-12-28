import {Component} from 'angular2/core';

@Component({
  directives: [],
  pipes: [],
  providers: [],
  selector: 'signin',
  template: require('./signin.html')
})
export class UserSignin {
  constructor() {
    console.debug('UserSignin constructor.');
  }

}
