import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
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
      this.connect();
    }).share();
  }

  public connect(): void {
    if (this._socket) {
      return;
    }
    console.debug('SocketService connecting');
    this._socket = io.connect(window.location.origin, new ConnectOpts());
    this._socket.on('connect', () => {
      this._socket.on('authenticated', () => {
        console.debug('SocketService connected');
        this._connectionObserver.next(true);
      }).emit('authenticate', {token: localStorage.getItem('token')});
    });
  }

  public disconnect(): void {
    if (!this._socket) {
      return;
    }
    console.debug('SocketService disconnecting');
    this._connectionObserver.next(false);
    this._socket.disconnect();
    this._socket = null;
  }

  public registerReceiver(prefix: string, callback: any): void {
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

  public emit(eventName: string, data?: any, callback?: any): void {
    if (!this._socket) {
      return;
    }
    this._socket.emit(eventName, data, function() {
      let args = arguments;
      if (callback) {
        callback.apply(this._socket, args);
      }
    });
  }

}
