import {Component, provide, ReflectiveInjector, ResolvedReflectiveProvider, ViewContainerRef} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {FORM_PROVIDERS} from 'angular2/common';

import {Navbar} from './shared/directives/navbar';
import {ModalConfig, ModalService} from './shared/services/modalService';
import {SocketService} from './shared/services/socketService';
import {UserService} from './shared/services/userService';
import {WindowService} from './shared/services/windowService';
import {About} from './components/about/about';
import {Chat} from './components/chat/chat';
import {Home} from './components/home/home';
import {UserProfile} from './components/user/profile';
import {UserSignin} from './components/user/signin';
import {UserSignout} from './components/user/signout';
import {UserSignup} from './components/user/signup';
require('../assets/scss/app.scss');


@Component({
  directives: [ROUTER_DIRECTIVES, Navbar],
  pipes: [],
  providers: [FORM_PROVIDERS, ModalService, SocketService, UserService, WindowService],
  selector: 'app',
  template: `
    <header>
      <navbar></navbar>
    </header>
    <main class="container">
      <router-outlet></router-outlet>
    </main>
  `
})
@RouteConfig([
  {component: Chat, name: 'Chat', path: '/chat'},
  {component: Home, name: 'Home', path: '/'},
  {component: UserProfile, name: 'Profile', path: '/profile'},
  {component: UserSignout, name: 'Signout', path: '/signout'},
  {component: UserSignup, name: 'Signup', path: '/signup'}
])
export class App {

  constructor(
    private _elementRef: ViewContainerRef,
    private _modalService: ModalService,
    private _userService: UserService
  ) {
    console.debug('App constructor.');
    this._registerGlobalModals();
  }

  private _getSigninProviders(): ResolvedReflectiveProvider[] {
     return ReflectiveInjector.resolve([provide(UserService, {useValue: this._userService})]);
  }

  private _registerGlobalModals(): void {
    this._modalService.registerModal(
      'About', new ModalConfig(About, this._elementRef)
    );
    this._modalService.registerModal(
      'Signin', new ModalConfig(UserSignin, this._elementRef, this._getSigninProviders())
    );
  }

}
