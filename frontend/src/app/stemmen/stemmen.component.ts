import { Component, OnInit } from '@angular/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';
import { Subscription, Observable } from 'rxjs';
import { UserService } from '../service/user.service';

export interface ChartType {
  index: number;
  name: string;
}

@Component({
  selector: 'app-stemmen',
  templateUrl: './stemmen.component.html',
  styles: []
})

export class StemmenComponent implements OnInit {

  private stemmenSubscription: Subscription;
  private stemmenConfigSubscription: Subscription;
  public dataSource: any;
  public chartConfig: any;
  private chartData: any;

  chartTypes: ChartType[] = [
    {name: 'Ja Nee Beetje', index: 0},
    {name: '1 ... 5', index: 1},
    {name: '1 ... 10', index: 2},
    {name: 'Ja Nee', index: 3},
  ];


  constructor(public rxStompService: RxStompService, private userService: UserService) {
    this.chartConfig = {
      width: '90%',
      height: '100%',
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
    this.stemmenConfigSubscription.unsubscribe();
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
