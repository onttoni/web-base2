import {Component, ViewChild} from 'angular2/core';
import {Router, RouterLink} from 'angular2/router';
import {User, UserService} from '../../shared/services/userService';
import {PersonDoc} from '../../shared/utils/personUtils';


@Component({
  properties: ['_doc', '_key'],
  selector: 'form-group',
  template: `
    <div class="form-group">
      <label class="text-capitalize">{{_key}}</label>
      <input type="text" class="form-control" *ngIf="_key!='password'"
        ngModel={{_doc.get(_key)}} #item (change)="onChange(item.value)" required/>
      <input type="password" class="form-control" *ngIf="_key=='password'"
        ngModel={{_doc.get(_key)}} #item (change)="onChange(item.value)" required/>
    </div>
  `
})
export class FormGroup {

  private _doc: any;
  private _key: string;

  public onChange(value: string) {
    console.debug('FormGroup onChange', value);
    this._doc.set(this._key, value);
  }
}


@Component({
  selector: 'form-group-password-verify',
  template: `
    <div class="form-group">
      <label class="text-capitalize">password.verify</label>
      <input type="password" class="form-control"
        [(ngModel)]=passwordVerify #item (change)="onChange(item.value)" required/>
    </div>
  `
})
export class FormGroupPasswordVerify {

  public passwordVerify: string;

  public onChange(value: string) {
    console.debug('FormGroupPasswordVerify onChange', value);
  }
}


@Component({
  directives: [FormGroup, FormGroupPasswordVerify, RouterLink],
  selector: 'signup',
  template: require('./signup.html')
})
export class UserSignup {

  private _doc: any = new PersonDoc('userSchema', {});
  private _displayFields: Array<string> = this._doc.doc.displayFields();
  @ViewChild(FormGroupPasswordVerify) private _formGroupPasswordVerify;

  constructor(private _router: Router, private _userService: UserService) {
    console.debug('UserSignup constructor.');
  }

  public onSubmit(): void {
    if (this._doc.doc.password !== this._formGroupPasswordVerify.passwordVerify) {
      console.error('Password verification failed.');
      return;
    }
    this._doc.doc.validate((err) => {
      if (err) {
        console.error('Validation error when signing up user:', err.errors);
        return;
      }
      this._userService.user$.subscribe(
        (user: User) => {
          if (user !== null) {
            this._router.navigate(['Home']);
          }
        }
      );
      this._userService.signup(new User(this._doc.extract()));
    });
  }

}
