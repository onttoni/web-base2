import {Component, View} from 'angular2/core';
import {FORM_DIRECTIVES, NgFor, NgIf} from 'angular2/common';
import {Router, RouterLink} from 'angular2/router';
import {User, UserService} from '../../shared/services/userService';
import {PersonDoc} from '../../shared/utils/personUtils';


@Component({
  properties: ['doc', 'key'],
  providers: [],
  selector: 'form-group'
})
@View({
  directives: [FORM_DIRECTIVES, NgIf],
  template: `<div class="form-group">
              <label class="text-capitalize">{{key}}</label>
              <input type="text" class="form-control" *ngIf="key!='password'"
                ngModel={{doc.get(key)}} #item (change)="onChange(item.value)" required/>
              <input type="password" class="form-control" *ngIf="key=='password'"
                ngModel={{doc.get(key)}} #item (change)="onChange(item.value)" required/>
            </div>
            <div class="form-group" *ngIf="key=='password'">
              <label>Verify password</label>
              <input type="password" class="form-control"
                [(ngModel)]="passwordVerify" required/>
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


@Component({
  directives: [FORM_DIRECTIVES, FormGroup, NgFor, RouterLink],
  pipes: [],
  providers: [],
  selector: 'signup',
  template: require('./signup.html')
})
export class UserSignup {

  public doc: any = new PersonDoc('userSchema', {});
  public displayFields: Array<string> = this.doc.doc.displayFields();

  constructor(private _router: Router, private _userService: UserService) {
    console.debug('UserSignup constructor.');
  }

  public onSubmit(): void {
    this.doc.doc.validate((err) => {
      if (err) {
        console.error('Validation error when signing up user', err.errors);
        return;
      }
      this._userService.user$.subscribe(
        (user: User) => {
          if (user !== null) {
            this._router.navigate(['Home']);
          }
        }
      );
      this._userService.signup(new User(this.doc.extract()));
    });
  }

}
