import {Component} from 'angular2/core';
import {Router, RouterLink} from 'angular2/router';
import {User, UserService} from '../../shared/services/userService';
import {Modal} from '../../shared/services/modalService';

@Component({
  directives: [RouterLink],
  pipes: [],
  providers: [],
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

  public onSubmit(): void {
    this._userService.user$.subscribe(
      (user: User) => {
        if (user !== null) {
          this._whenClosedObserver.next(true);
          this._router.navigate(['Home']);
        }
      }
    );
    this._userService.signin(new User(this.email, this.password));
  }

}
