import {Injectable} from 'angular2/core';
import {BaseRequestOptions, Headers, Http, URLSearchParams} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import _ = require('lodash');


class UpdateRequestOptions extends BaseRequestOptions {
  public headers: Headers = new Headers({'Content-Type': 'application/json'});
}


class SigninRequestOptions extends BaseRequestOptions {
  public search: URLSearchParams = new URLSearchParams('login=true');
  public headers: Headers = new Headers({'Content-Type': 'application/json'});
}


class SignoutRequestOptions extends BaseRequestOptions {
  public search: URLSearchParams = new URLSearchParams('logout=true');
}


class SignupRequestOptions extends BaseRequestOptions {
  public search: URLSearchParams = new URLSearchParams('signup=true');
  public headers: Headers = new Headers({'Content-Type': 'application/json'});
}


class Name {
  public given: string;
  public family: string;
  public formatted: string;
}


interface UserInterface {
  email: string;
  name?: Name;
  password?: string;
  token?: string;
}


export class User implements UserInterface {
  public email: string;
  public name: Name;
  public password: string;
  public token: string;

  constructor(obj: any);
  constructor(email: string, password: string);
  constructor(emailOrObj: any, password?: string) {
    console.debug('User constructor.');
    this.email = _.get(emailOrObj, 'email', emailOrObj);
    this.password = _.get(emailOrObj, 'password', password);
    this.name = _.get(emailOrObj, 'name', new Name());
    console.debug('User is:', this);
  }
}


@Injectable()
export class UserService {
  public user$: Observable<User>;
  private _signedIn: boolean = false;
  private _userObserver: Observer<User>;
  private _user: User = null;

  constructor(private _http: Http) {
    console.debug('UserService constructor.');
    this.user$ = Observable.create(observer => {
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

  public signup(user: User): void {
    this._http.post('/api/users', JSON.stringify(user), new SignupRequestOptions())
    .map(response => response.json())
    .subscribe(data => this._setSignedIn(data), error => this._unsetSignedIn());
  }

  public update(user: User): void {
    this._http.put('/api/users', JSON.stringify(user), new UpdateRequestOptions())
    .map(response => response.json())
    .subscribe(data => this._setSignedIn(data), error => this._unsetSignedIn());
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
