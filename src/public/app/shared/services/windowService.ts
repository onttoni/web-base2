import {Injectable} from 'angular2/core';

@Injectable()
export class WindowService {

  constructor() {
    console.debug('WindowService constructor');
  }

  public openPopup(url: string, width = 480, height = 640) {
    console.debug(`WindowService openPopup ${url}`);
    let left = (screen.availWidth / 2) - (width / 2);
    let top = (screen.availHeight / 2) - (height / 2);
    let newWindow = window.open(url, '', `width=${width}, height=${height}, left=${left}, top=${top}`);
    if (window.focus) {
      newWindow.focus();
    }
  }
}
