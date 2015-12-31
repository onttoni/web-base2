import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {FORM_PROVIDERS} from 'angular2/common';

import {Navbar} from './shared/directives/navbar';
import {SocketService} from './shared/services/socketService';
import {UserService} from './shared/services/userService';
import {About} from './components/about/about';
import {Chat} from './components/chat/chat';
import {Home} from './components/home/home';
import {UserProfile} from './components/user/profile';
import {UserSignin} from './components/user/signin';
import {UserSignout} from './components/user/signout';
import {UserSignup} from './components/user/signup';

@Component({
  directives: [ROUTER_DIRECTIVES, Navbar],
  pipes: [],
  providers: [FORM_PROVIDERS, SocketService, UserService],
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
  {component: About, name: 'About', path: '/about'},
  {component: Chat, name: 'Chat', path: '/chat'},
  {component: Home, name: 'Home', path: '/'},
  {component: UserProfile, name: 'Profile', path: '/profile'},
  {component: UserSignin, name: 'Signin', path: '/signin'},
  {component: UserSignout, name: 'Signout', path: '/signout'},
  {component: UserSignup, name: 'Signup', path: '/signup'}
])
export class App {

  constructor() {
    console.debug('App constructor.');
  }

}
