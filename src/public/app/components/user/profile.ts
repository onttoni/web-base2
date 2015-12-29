import {Component, View} from 'angular2/core';
import {FORM_DIRECTIVES, NgFor, NgIf} from 'angular2/common';
import {Router, RouterLink} from 'angular2/router';
import {User, UserService} from '../../shared/services/userService';
import {PersonDoc} from '../../shared/utils/personUtils';


@Component({
  properties: ['doc', 'key'],
  selector: 'form-group'
})
@View({
  directives: [FORM_DIRECTIVES],
  template: `<div class="form-group">
              <label class="text-capitalize">{{key}}</label>
              <input type="text" class="form-control"
                ngModel={{doc.get(key)}} #item (change)="onChange(item.value)" required/>
            </div>`
})
export class FormGroup {

  public doc: any;
  public key: string;

  public onChange(value: string) {
    console.debug('FormGroup onChange', value);
    this.doc.set(this.key, value);
  }
}


@Component({})
@View({
  directives: [FORM_DIRECTIVES, FormGroup, NgFor, NgIf, RouterLink],
  // providers: [],
  // pipes: [],
  // styles: [ require('./some.css') ],
  template: require('./profile.html')
})
export class UserProfile {

  public doc: any = new PersonDoc('userSchema', {});
  public displayFields: Array<string> = this.doc.doc.displayFields();

  constructor(private _router: Router, private _userService: UserService) {
    console.debug('UserProfile constructor');
    this.whoAmI();
  }

  public cancel(): void {
    console.debug('UserProfile cancelled');
    this._router.navigate(['Home']);
  }

  public ngOnChanges(changeRecord) {
    console.debug('change', changeRecord);
  }

  public ngOnInit() {
    console.debug('UserProfile ngOnInit');
  }

  public onSubmit(): void {
    console.debug('UserProfile onSubmit');
    console.debug('UserProfile doc is now', this.doc);
    this.doc.doc.validate((err) => {
      if (err) {
        console.debug('Validation error when updating user', err.errors);
        return;
      }
      this._userService.user$.subscribe(
        (user: User) => {
          if (user !== null) {
            this._router.navigate(['Home']);
          }
        }
      );
      this._userService.update(new User(this.doc.extract()));
    });
  }

  private whoAmI(): void {
    let _user = this._userService.get();
    if (_user !== null) {
      this.doc.update(_user);
    } else {
      this._userService.user$.subscribe(
        (user: User) => {
          if (user !== null) {
            this.doc.update(user);
          }
        }
      );
    }
  }

}
