import { Component, OnInit } from '@angular/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';
import { Subscription, Observable } from 'rxjs';
import {RxStompState} from '@stomp/rx-stomp';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-messages',
  template: `
<div id="status">
  <div id="indicator" class="{{connectionStatus$|async}}"></div>
  <span id="status-label">{{connectionStatus$|async}}</span>
  <button class="btn" (click)="rxStompService.activate()">Activate</button>
  <button class="btn" (click)="rxStompService.deactivate()">DeActivate</button>
  <button class="btn" (click)="rxStompService.stompClient.forceDisconnect()">Simulate Error</button>
  <h2>Error message</h2>
{{errorMessage}}
</div>
<div id="messages">
    <button class="btn btn-primary" (click)="onSendMessage()">Send Test Message</button>
    <h2>Received messages</h2>
    <ol>
        <!-- we will use Angular binding to populate list of messages -->
        <li class="message" *ngFor="let message of receivedMessages">{{message}}</li>
    </ol>
</div>
<div id="count">
    <button class="btn btn-primary" (click)="onCount(true)">Up</button>
    <button class="btn btn-primary" (click)="onCount(false)">Down</button>
    <h2>Counter</h2>
    <div>{{count}}</div>
</div>
  `,
  styles: []
})
export class MessagesComponent implements OnInit {

  constructor(public rxStompService: RxStompService) { 
    this.connectionStatus$ = rxStompService.connectionState$.pipe(map((state) => {
      // convert numeric RxStompState to string
      return RxStompState[state];
    }));
  }
  public connectionStatus$: Observable<string>;
  public receivedMessages: string[] = [];
  public errorMessage: string;
  public count:any;
  private topicSubscription: Subscription;
  private errorSubscription: Subscription;
  private countSubscription: Subscription;

  ngOnInit() {
    this.topicSubscription = this.rxStompService.watch('/topic/demo').subscribe((message: Message) => {
      this.receivedMessages.push(message.body);
    });
    this.errorSubscription = this.rxStompService.watch('/topic/errors').subscribe((message: Message) => {
      this.errorMessage = message.body;
    });
    this.countSubscription = this.rxStompService.watch('/topic/counter').subscribe((message: Message) => {
      this.count = message.body;
    });
  }

  ngOnDestroy() {
    this.topicSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
    this.countSubscription.unsubscribe();
  }
  
  onSendMessage() {
    const message = {text: `Message generated at ${new Date}`};
    this.rxStompService.publish({destination: '/app/message', body: JSON.stringify(message)});
  }
  onCount(isUp: boolean) {
    const message = {direction: isUp?'up':'down'};
    this.rxStompService.publish({destination: '/app/counter', body: JSON.stringify(message)});
  }
}
