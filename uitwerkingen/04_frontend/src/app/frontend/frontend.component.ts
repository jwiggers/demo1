import { Component, OnInit, OnDestroy } from '@angular/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';
import { Subscription, Observable } from 'rxjs';
import {RxStompState} from '@stomp/rx-stomp';
import {map} from 'rxjs/operators';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-frontend',
  templateUrl: './frontend.component.html',
  styles: [
       '#indicator { display: inline-block; }'
    ]
})
export class FrontendComponent implements OnInit, OnDestroy {


  public message2Send : string;
  public connectionStatus$: Observable<string>;
  public receivedMessages: string[] = [];
  public timer: string;
  private timerSubscription: Subscription;
  private messagesSubscription: Subscription;

  constructor(public rxStompService: RxStompService) { 
    this.connectionStatus$ = rxStompService.connectionState$.pipe(map((state) => {
      // convert numeric RxStompState to string
      return RxStompState[state];
    }));
  }

  ngOnInit() {
    this.timerSubscription = this.rxStompService.watch('/topic/timer').subscribe((message: Message) => {
      this.timer =message.body;
    });
    this.messagesSubscription = this.rxStompService.watch('/topic/messages').subscribe((message: Message) => {
      console.log(message.body);
      this.receivedMessages = JSON.parse(message.body);
    });
  }

  ngOnDestroy() {
    this.timerSubscription.unsubscribe();
    this.messagesSubscription.unsubscribe();
  }
  
  sendMessage() {
    this.rxStompService.publish({destination: '/app/message', body: JSON.stringify(this.message2Send)});
  }

}
