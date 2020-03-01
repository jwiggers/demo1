import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { Subscription, Observable } from "rxjs";
import { RxStompService } from "@stomp/ng2-stompjs";
import { RxStompState } from "@stomp/rx-stomp";
import { Message } from "@stomp/stompjs";
import { map } from 'rxjs/operators';

@Component({
  selector: "app-snelheid",
  template: `
  <div>
    <fusioncharts width="450" height="250" type="AngularGauge" [dataSource]="speedSource" > </fusioncharts>
    <button class="btn btn-primary" (click)="onCount(false)">Langzamer</button>
    <button class="btn btn-primary" (click)="onCount(true)">Sneller</button>
</div>
  `,
  styles: []
})
export class SnelheidComponent implements OnInit {
  chartTypeControl = new FormControl("", [Validators.required]);
  public speedSource = {
    chart: {
      caption: "Gewenste snelheid van de presentatie",
      lowerLimit: "-20",
      upperLimit: "20",
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
          minValue: "-20",
          maxValue: "-15",
          code: "#F2726F" // rood
        },
        {
          minValue: "-15",
          maxValue: "-10",
          code: "#FFC533" // oranje
        },
        {
          minValue: "-10",
          maxValue: "+10",
          code: "#62B58F" // groen
        },
        {
          minValue: "10",
          maxValue: "15",
          code: "#FFC533" // oranje
        },
        {
          minValue: "15",
          maxValue: "20",
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

  constructor(public rxStompService: RxStompService) { }

  ngOnInit() {
    this.rxStompService
      .watch("/topic/counter")
      .subscribe((message: Message) => {
        this.speedSource.dials.dial[0].value = message.body;
      });
  }
  onCount(isUp: boolean) {
    this.rxStompService.publish({destination: '/app/counter', body: isUp?'up':'down'});
  }
}
