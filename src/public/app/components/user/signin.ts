import {Component} from 'angular2/core';
import {Router, RouterLink} from 'angular2/router';
import {User, UserService} from '../../shared/services/userService';
import {Modal} from '../../shared/services/modalService';

@Component({
  directives: [RouterLink],
  selector: 'signin',
  template: require('./signin.html')
})
export class UserSignin extends Modal {
  public email: string;
  public password: string;

  constructor(private _router: Router, private _userService: UserService) {
    super();
    console.debug('UserSignin constructor.');
  }

  public onCancel(): void {
    this._whenClosedObserver.next(true);
  }

  public onLocal(): void {
    this._userService.user$.subscribe(
      (user: User) => {
        if (user !== null) {
          this._whenClosedObserver.next(true);
          this._router.navigate(['Home']);
        }
      }
    );
    this._userService.signinLocal(new User(this.email, this.password));
  }

  public onSignup() {
    this._whenClosedObserver.next(true);
    this._router.navigate(['Signup']);
  }

  public onGoogle() {
    this._userService.signinGoogle();
  }

}
