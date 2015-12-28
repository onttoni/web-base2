import {Injectable} from 'angular2/core';
import {BaseRequestOptions, Headers, Http, URLSearchParams} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import _ = require('lodash');


class SigninRequestOptions extends BaseRequestOptions {
  public search: URLSearchParams = new URLSearchParams('login=true');
  public headers: Headers = new Headers({'Content-Type': 'application/json'});
}


class SignoutRequestOptions extends BaseRequestOptions {
  public search: URLSearchParams = new URLSearchParams('logout=true');
}


interface UserInterface {
  email: string;
  name: {
    formatted: string;
  };
  password?: string;
  token?: string;
}


export class User implements UserInterface {
  public name: {
    formatted: string;
  };
  public token: string;

  constructor(public email: string, public password: string) {
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
    this._http.get('/api/users')
    .map(response => response.json())
    .subscribe(data => this._setSignedIn(data), error => this._unsetSignedIn());
    return null;
  }

  public signin(user: User): void {
    this._http.post('/api/users', JSON.stringify(user), new SigninRequestOptions())
    .map(response => response.json())
    .subscribe(data => this._setSignedIn(data), error => this._unsetSignedIn());
  }

  public signout(): void {
    this._http.get('/api/users', new SignoutRequestOptions())
    .map(response => response.json())
    .subscribe(null, null, () => this._unsetSignedIn());
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
