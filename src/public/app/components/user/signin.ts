import {Component} from 'angular2/core';
import {Router, RouterLink} from 'angular2/router';
import {User, UserService} from '../../shared/services/userService';

@Component({
  directives: [RouterLink],
  pipes: [],
  providers: [],
  selector: 'signin',
  template: require('./signin.html')
})
export class UserSignin {
  public email: string;
  public password: string;

  constructor(private _router: Router, private _userService: UserService) {
    console.debug('UserSignin constructor.');
  }

  public onCancel(): void {
    this._router.navigate(['Home']);
  }

  public onSignin(): void {
    this._userService.user$.subscribe(
      (user: User) => {
        if (user !== null) {
          this._router.navigate(['Home']);
        }
      }
    );
    this._userService.signin(new User(this.email, this.password));
  }

}
