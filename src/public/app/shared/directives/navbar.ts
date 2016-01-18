import {NgIf} from 'angular2/common';
import {Component} from 'angular2/core';
import {RouterLink} from 'angular2/router';
import {ModalService} from '../services/modalService';
import {User, UserService} from '../services/userService';


@Component({
  directives: [NgIf, RouterLink],
  pipes: [],
  providers: [],
  selector: 'navbar',
  template: require('./navbar.html')
})
export class Navbar {

  public userName: string = '';
  public isSignedIn: boolean = false;

  constructor(private _modalService: ModalService, private _userService: UserService) {
    console.debug('Navbar constructor.');
    this._subscribeUserObserver();
  }

  private _subscribeUserObserver(): void {
    this._userService.user$.subscribe(
      (user: User) => {
        if (user !== null) {
          this.userName = user.name.formatted;
          this.isSignedIn = true;
        } else {
          this.userName = '';
          this.isSignedIn = false;
        }
      }
    );
  }

}
