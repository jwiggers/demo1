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
  ...............

  constructor(public rxStompService: RxStompService) { 
  	......................
  }

  ngOnInit() {
  	......................................
  }

  ngOnDestroy() {
  }
  
  sendMessage() {
    .....................................
  }

}
