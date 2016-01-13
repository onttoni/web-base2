import {ELEMENT_PROBE_PROVIDERS, bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {HTTP_PROVIDERS, Http} from 'angular2/http';
import {enableProdMode, provide} from 'angular2/core';
import {AuthConfig, AuthHttp} from 'angular2-jwt';
import {App} from './app/app.component';

if ('production' === process.env.ENV) {
  enableProdMode();
}

function provideAuthHttp() {
  return provide(AuthHttp, {
    deps: [Http],
    useFactory: (http) => {
      return new AuthHttp(new AuthConfig({
        tokenName: 'token',
      }), http);
    }
  });
}

function main() {
  return bootstrap(App, [
    HTTP_PROVIDERS,
    ROUTER_PROVIDERS,
    ('production' === process.env.ENV ? [] : ELEMENT_PROBE_PROVIDERS),
    provideAuthHttp()
  ])
  .catch(err => console.error(err));
}

document.addEventListener('DOMContentLoaded', main);
