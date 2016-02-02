import {Injectable} from 'angular2/core';
import {Headers, Http, RequestOptionsArgs} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {ModalRef, ModalService} from '../services/modalService';
import {WindowService} from './windowService';
import _ = require('lodash');


class UserRequestOptions implements RequestOptionsArgs {
  public headers: Headers = new Headers({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  });
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
  private _userObserver: Observer<User>;
  private _user: User = null;
  private _modalRef: Promise<ModalRef> = null;

  constructor(private _http: Http, private _modalService: ModalService, private _windowService: WindowService) {
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
    this._http.get('/api/users', new UserRequestOptions())
    .map(response => response.json())
    .subscribe(data => this._setSignedIn(data), error => this._unsetSignedIn());
    return null;
  }

  public openSigninModal(): void {
    this._modalRef = this._modalService.openModal('Signin');
  }

  public signinLocal(user: User): void {
    this._http.post('/api/users/signin-local', JSON.stringify(user), new UserRequestOptions())
    .map(response => response.json())
    .subscribe(
      data => {
        this._setSignedIn(data);
      },
      error => {
        console.error('Local signin failed', error);
        this._unsetSignedIn();
      }
    );
  }

  public signinGoogle(): void {
    this._modalRef.then(modalRef => modalRef.close());
    this._http.get('/api/users/signin-google')
    .map(response => response.json())
    .subscribe(
      data => {
        this._windowService.goTo(data.authUrl);
      },
      error => {
        console.error('Google signin failed', error);
        this._unsetSignedIn();
      }
    );
  }

  public signinAccessCode(token: string): void {
    this._http.post('/api/users/signin-access-code', JSON.stringify({code: token}), new UserRequestOptions())
    .map(response => response.json())
    .subscribe(
      data => {
        this._setSignedIn(data);
      },
      error => {
        console.error('Access code signin failed', error);
        this._unsetSignedIn();
      }
    );
  }

  public signout(): void {
    this._http.get('/api/users/signout', new UserRequestOptions())
    .map(response => response.json())
    .subscribe(null, null, () => this._unsetSignedIn());
  }

  public signup(user: User): void {
    this._http.post('/api/users/signup', JSON.stringify(user), new UserRequestOptions())
    .map(response => response.json())
    .subscribe(data => this._setSignedIn(data), error => this._unsetSignedIn());
  }

  public update(user: User): void {
    this._http.put('/api/users', JSON.stringify(user), new UserRequestOptions())
    .map(response => response.json())
    .subscribe(data => this._setSignedIn(data), error => this._unsetSignedIn());
  }

  private _setSignedIn(data): void {
    let user: any = _.get(data, 'user') || data;
    let token: any = _.get(data, 'token');
    console.debug('Sign in for user:', user);
    this._user = user;
    if (token) {
      console.debug('User got token.');
      localStorage.setItem('token', token);
    }
    this._userObserver.next(this._user);
  }

  private _unsetSignedIn(): void {
    console.debug('User sign out.');
    this._user = null;
    localStorage.removeItem('token');
    this._userObserver.next(null);
  }

}
