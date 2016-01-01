import {Component} from 'angular2/core';
import {NgModel, NgFor} from 'angular2/common';
import {Router} from 'angular2/router';
import {Subscription} from 'rxjs/Subscription';
import {SocketService} from '../../shared/services/socketService';

let chatInstance;

@Component({
  directives: [NgModel, NgFor],
  // pipes: [],
  // providers: [],
  selector: 'chat',
  template: require('./chat.html')
})
export class Chat {

  private _input: string;
  private _messages: Array<string> = [];
  private _socketServiceSubsc: Subscription<boolean>;

  constructor(private _router: Router, private _socketService: SocketService) {
    console.debug('Chat constructor.');
    chatInstance = this;
  }

  public getMessages(): Array<string> {
    return this._messages;
  }

  public ngOnDestroy() {
    console.debug('Chat ngOnDestroy');
    this._socketService.emit('chat', {event: 'left'});
    this._socketService.deregisterReceiver('chat');
    this._socketServiceSubsc.unsubscribe();
  }

  public ngOnInit() {
    console.debug('Chat ngOnInit');
    this._socketService.registerReceiver('chat', this.onReceive);
    this._socketServiceSubsc = this._socketService.connection$.subscribe(
      (connected: boolean) => {
        if (connected) {
          this._socketService.emit('chat', {event: 'joined'});
        }
      }
    );
  }

  public onReceive(data: string): void {
    chatInstance._messages.push(data);
  }

  public onSend(data: string): void {
    this._socketService.emit('chat', {msg: this._input});
    this._input = '';
  }

}
