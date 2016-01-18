import {Component} from 'angular2/core';
import {Modal} from '../../shared/services/modalService';

@Component({
  directives: [],
  pipes: [],
  providers: [],
  selector: 'about',
  template: require('./about.html')
})
export class About extends Modal {
  constructor() {
    console.debug('About constructor.');
    super();
  }

  public onOk(): void {
    this._whenClosedObserver.next(true);
  };

  public getUa(): string {
    return navigator.userAgent;
  };

}
