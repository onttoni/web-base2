import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import _ = require('lodash');
import io = require('socket.io-client');


class ConnectOpts {
  public forceNew: boolean = true;
  public reconnection: boolean = true;
  public reconnectionDelay: number = 2000;
  public reconnectionDelayMax: number = 60000;
  public reconnectionAttempts: number = -1;
  public timeout: number = 10000;
}


@Injectable()
export class SocketService {
  public connection$: Observable<boolean>;
  private _clientObservables: {[prefix: string]: Observable<string>} = {};
  private _connectionObserver: Observer<boolean>;
  private _socket = null;

  constructor() {
    console.debug('SocketService constructor.');
    this.connection$ = Observable.create(observer => {
      this._connectionObserver = observer;
    }).share();
  }

  public isConnected(): boolean {
    return _.get(this, '_socket.connected', false);
  }

  public registerReceiver(prefix: string, callback: any): void {
    this._connect();
    this._clientObservables[prefix] = Observable.fromEventPattern(
      () => {
        this._socket.on(prefix, callback);
      },
      () => {
        console.error('Not implemented: fromEventPattern removeHandler.');
      }
    );
    this._clientObservables[prefix].subscribe(
      (result) => {
        console.debug('Next: %s', result);
      },
      (err) => {
        console.error('Error: ' + err);
      },
      () => {
        console.debug('Completed');
      });
  }

  public deregisterReceiver(prefix: string): void {
    delete this._clientObservables[prefix];
    if (_.size(this._clientObservables) === 0) {
      this._disconnect();
    }
  }

  public emit(eventName: string, data?: any, callback?: any): void {
    if (this.isConnected() === false) {
      return;
    }
    this._socket.emit(eventName, data, function() {
      let args = arguments;
      if (callback) {
        callback.apply(this._socket, args);
      }
    });
  }

  private _connect(): void {
    if (this.isConnected() === true) {
      this._connectionObserver.next(true);
      return;
    }
    console.debug('SocketService connecting');
    this._socket = io.connect(window.location.origin, new ConnectOpts());
    this._socket.on('connect', () => {
      this._socket.on('authenticated', () => {
        console.debug('SocketService connected');
        this._connectionObserver.next(true);
      }).emit('authenticate', {token: localStorage.getItem('token')});
      this._socket.on('unauthorized', () => {
        console.debug('SocketService server rejected connection: unauthorized');
        this._disconnect();
      });
    });
  }

  private _disconnect(): void {
    this._connectionObserver.next(false);
    if (this.isConnected() === false) {
      return;
    }
    console.debug('SocketService disconnecting');
    this._socket.disconnect();
  }

}
