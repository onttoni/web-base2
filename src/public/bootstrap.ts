import {ELEMENT_PROBE_PROVIDERS, bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
import {enableProdMode} from 'angular2/core';
import {App} from './app/app.component';

if (process.env.NODE_ENV !== 'dev') {
  enableProdMode();
}

function main() {
  return bootstrap(App, [
    HTTP_PROVIDERS,
    ROUTER_PROVIDERS,
    (process.env.NODE_ENV === 'dev' ? ELEMENT_PROBE_PROVIDERS : [])
  ])
  .catch(err => console.error(err));
}

document.addEventListener('DOMContentLoaded', main);
