import {Injectable} from 'angular2/core';

export class User {

}

@Injectable({})
export class UserService {
  constructor() {
    console.debug('UserService constructor.');
  }
}
