import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import _ = require('lodash');


interface UserInterface {
  email: string;
  name: {
    formatted: string;
  };
  password?: string;
  token?: string;
}


export class User implements UserInterface {
  public email: string;
  public name: {
    formatted: string;
  };
  public password: string;
  public token: string;

  constructor() {
    console.debug('User constructor.');
  }
}


@Injectable()
export class UserService {
  public user$: Observable<User>;
  private _signedIn: boolean = false;
  private _userObserver: any;
  private _user: User = null;

  constructor(private _http: Http) {
    console.debug('UserService constructor.');
    this.user$ = new Observable(observer => {
      this._userObserver = observer;
      this.get();
    }).share();
  }

  public get(): User {
    if (this._user !== null) {
      return this._user;
    }
    this._http.get('/api/users/')
    .map(response => response.json())
    .subscribe(data => this._setSignedIn(data), error => this._unsetSignedIn());
    return null;
  }

  public signin(): void {

  }

  public signout(): void {

  }

  public signup(): void {

  }

  public update(): void {

  }

  private _setSignedIn(data) {
    let user: any = _.get(data, 'user') || data;
    let token: any = _.get(data, 'token');
    console.debug('Sign in for user:', user);
    this._signedIn = true;
    this._user = user;
    if (token) {
      console.debug('User got token.');
      localStorage.setItem('token', token);
    }
    this._userObserver.next(this._user);
  }

  private _unsetSignedIn() {
    console.debug('User sign out.');
    this._signedIn = false;
    this._user = null;
    localStorage.removeItem('token');
    this._userObserver.next(null);
  }

}
