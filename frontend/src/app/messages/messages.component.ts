import { Component, OnInit } from '@angular/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';
import { Subscription, Observable } from 'rxjs';
import {RxStompState} from '@stomp/rx-stomp';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-messages',
  templateUrl: './message.component.html',
  styles: [
       '#indicator { display: inline-block; }',
    ]
})
export class MessagesComponent implements OnInit {

  public connectionStatus$: Observable<string>;
  public receivedMessages: string[] = [];
  public errorMessage: string;
  public count:any;
  private topicSubscription: Subscription;
  private errorSubscription: Subscription;
  private countSubscription: Subscription;
  private dataSource: Object;
  private chartConfig: Object;
  private chartData: any;

  constructor(public rxStompService: RxStompService) { 
    this.connectionStatus$ = rxStompService.connectionState$.pipe(map((state) => {
      // convert numeric RxStompState to string
      return RxStompState[state];
    }));
    this.chartConfig = {
      width: '500',
      height: '200',
      type: 'column2d',
      dataFormat: 'json',
  };

    this.chartData = [{
      "label": "Ja",
      "value": "18"
    }, {
      "label": "Beetje",
      "value": "7"
    }, {
      "label": "Nee",
      "value": "5"
    }];
    this.dataSource = this.buildDataSource(this.chartData);
  }

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
    this.countSubscription = this.rxStompService.watch('/topic/stemmen').subscribe((message: Message) => {
      let data = JSON.parse(message.body);
      this.dataSource = this.buildDataSource(data);
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
  onStemmen(col: any) {
    console.log("onStemmen " + col);
    this.rxStompService.publish({destination: '/app/stemmen', body: JSON.stringify(col)});
  }
  buildDataSource(data: []) {
    return {
      "chart": {
        "caption": "Enquete",
        "subCaption": "bla die bla",
        "xAxisName": "Keuzes",
        "yAxisName": "aantal",
        // "numberSuffix": "K",
        "theme": "fusion",
      },
      "data": data 
    };
  }
}
