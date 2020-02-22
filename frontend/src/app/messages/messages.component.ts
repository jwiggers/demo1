import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';
import { Subscription, Observable } from 'rxjs';
import {RxStompState} from '@stomp/rx-stomp';
import {map} from 'rxjs/operators';
import {FormControl, Validators} from '@angular/forms';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-messages',
  templateUrl: './message.component.html',
  styles: [
       '#indicator { display: inline-block; }',
       '.stemmenConfig label { margin-right: 50px; }'
    ]
})
export class MessagesComponent implements OnInit, OnDestroy {

  @HostListener('window:beforeunload', [ '$event' ])
    beforeUnloadHandler(event) {
      this.ngOnDestroy();
  }

  public connectionStatus$: Observable<string>;
  public receivedMessages: string[] = [];
  public errorMessage: string;
  public count:any;
  private topicSubscription: Subscription;
  private errorSubscription: Subscription;
  private countSubscription: Subscription;
  private loginSubscription: Subscription;

  private loggedInUsers: string[] = [];

  chartTypeControl = new FormControl('', [Validators.required]);
  public speedSource = {
    chart: {
      caption: "Gewenste snelheid van de presentatie",
      lowerLimit: "-100",
      upperLimit: "100",
      showValue: "0",
      numberSuffix: "",
      theme: "fusion",
      showToolTip: "0",
      gaugeStartAngle: 140,
      gaugeEndAngle: 40
    },
    // Gauge Data
    colorRange: {
      color: [
        {
          minValue: "-100",
          maxValue: "-50",
          code: "#F2726F" // rood
        },
        {
          minValue: "-50",
          maxValue: "-20",
          code: "#FFC533" // oranje
        },
        {
          minValue: "-20",
          maxValue: "+20",
          code: "#62B58F" // groen
        },
        {
          minValue: "20",
          maxValue: "50",
          code: "#FFC533" // oranje
        },
        {
          minValue: "50",
          maxValue: "100",
          code: "#F2726F" // rood
        }
      ]
    },
    dials: {
      dial: [
        {
          value: "0"
        }
      ]
    }
  };

  constructor(public rxStompService: RxStompService, private userService: UserService) { 
    this.connectionStatus$ = rxStompService.connectionState$.pipe(map((state) => {
      // convert numeric RxStompState to string
      return RxStompState[state];
    }));
  }

  ngOnInit() {
    this.topicSubscription = this.rxStompService.watch('/topic/demo').subscribe((message: Message) => {
      this.receivedMessages.push(message.body);
    });
    this.errorSubscription = this.rxStompService.watch('/topic/errors').subscribe((message: Message) => {
      this.errorMessage = message.body;
    });
    this.countSubscription = this.rxStompService.watch('/topic/counter').subscribe((message: Message) => {
      console.log("counter: " + message.body);
      this.count = message.body;
      this.speedSource.dials.dial[0].value = message.body;
    });
    this.loginSubscription = this.rxStompService.watch('/topic/users').subscribe((message: Message) => {
      this.loggedInUsers = JSON.parse(message.body);
    });
  }

  ngOnDestroy() {
    this.rxStompService.publish({destination: '/app/userLoggedOff', body: JSON.stringify(this.userService.getName())});
    this.topicSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
    this.countSubscription.unsubscribe();
    this.loginSubscription.unsubscribe();
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
