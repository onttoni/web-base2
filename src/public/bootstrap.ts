import {bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
// include for development builds
import {ELEMENT_PROBE_PROVIDERS} from 'angular2/platform/common_dom';
// include for production builds
// import {enableProdMode} from 'angular2/core';

import {App} from './app/app.component';

// enableProdMode() // include for production builds
function main() {
  return bootstrap(App, [
    // These are dependencies of our App
    HTTP_PROVIDERS,
    ROUTER_PROVIDERS,
    ELEMENT_PROBE_PROVIDERS // remove in production
  ])
  .catch(err => console.error(err));
}

document.addEventListener('DOMContentLoaded', main);
