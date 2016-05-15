import {ELEMENT_PROBE_PROVIDERS, bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
import {enableProdMode} from 'angular2/core';
import {App} from './app/app.component';

let dev: boolean = process.env.NODE_ENV === 'dev';

if (!dev) {
  enableProdMode();
  console.debug = () => undefined;
  console.log = () => undefined;
}

function main() {
  return bootstrap(App, [
    HTTP_PROVIDERS,
    ROUTER_PROVIDERS,
    (dev ? ELEMENT_PROBE_PROVIDERS : [])
  ])
  .catch(err => console.error(err));
}

document.addEventListener('DOMContentLoaded', main);
