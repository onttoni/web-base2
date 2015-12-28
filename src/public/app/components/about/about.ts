import {Component} from 'angular2/core';
import {Router} from 'angular2/router';

@Component({
  directives: [],
  pipes: [],
  providers: [],
  selector: 'about',
  template: require('./about.html')
})
export class About {
  constructor(private router: Router) {
    console.debug('About constructor.');
  }

  public onOk(): void {
    this.router.navigate(['Home']);
  };

  public getUa(): string {
    return navigator.userAgent;
  };

}
