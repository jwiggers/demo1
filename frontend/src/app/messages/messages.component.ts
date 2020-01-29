import { Component, OnInit } from '@angular/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';
import { Subscription, Observable } from 'rxjs';
import {RxStompState} from '@stomp/rx-stomp';
import {map} from 'rxjs/operators';
import {FormControl, Validators} from '@angular/forms';

export interface ChartType {
  index: number;
  name: string;
}

@Component({
  selector: 'app-messages',
  templateUrl: './message.component.html',
  styles: [
       '#indicator { display: inline-block; }',
       '.stemmenConfig label { margin-right: 50px; }'
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
  private stemmenSubscription: Subscription;
  private stemmenConfigSubscription: Subscription;
  public dataSource: any;
  public chartConfig: any;
  private chartData: any;

  chartTypeControl = new FormControl('', [Validators.required]);
  chartTypes: ChartType[] = [
    {name: 'Ja Nee Beetje', index: 0},
    {name: '1 ... 5', index: 1},
    {name: '1 ... 10', index: 2},
    {name: 'Ja Nee', index: 3},
  ];
  public speedSource = {
    chart: {
      caption: "Gewenste snelheid van de presentatie",
      lowerLimit: "0",
      upperLimit: "100",
      showValue: "1",
      numberSuffix: "%",
      theme: "fusion",
      showToolTip: "0"
    },
    // Gauge Data
    colorRange: {
      color: [
        {
          minValue: "0",
          maxValue: "50",
          code: "#F2726F"
        },
        {
          minValue: "50",
          maxValue: "75",
          code: "#FFC533"
        },
        {
          minValue: "75",
          maxValue: "99999",
          code: "#62B58F"
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
      console.log("counter: " + message.body);
      this.count = message.body;
      this.speedSource.dials.dial[0].value = message.body;
    });
    this.stemmenSubscription = this.rxStompService.watch('/topic/stemmen').subscribe((message: Message) => {
      console.log("stemmen: " + message.body);
      let data = JSON.parse(message.body);
      this.dataSource = this.buildDataSource(data);
    });
    this.stemmenConfigSubscription = this.rxStompService.watch('/topic/chartConfig').subscribe((message: Message) => {
      console.log("chartConfig: " + message.body);
      let config = JSON.parse(message.body);
      this.dataSource = config;
    });

  }

  ngOnDestroy() {
    this.topicSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
    this.countSubscription.unsubscribe();
    this.stemmenConfigSubscription.unsubscribe();
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
  onStemmenConfig(type: number) {
    console.log("onStemmenConfig " + type);
    this.rxStompService.publish({destination: '/app/chartConfig', body: JSON.stringify(type)});
  }
  buildDataSource(data: []) {
    return {
      "chart": {
        "caption": "Enquete",
        "subCaption": "bla die bla",
        "xAxisName": "Keuzes",
        "yAxisName": "aantal",
        "numberSuffix": "",
        "theme": "fusion",
      },
      "data": data 
    };
  }
}
