import { Injectable } from '@angular/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';
import { Subscription, Observable } from 'rxjs';
import {RxStompState} from '@stomp/rx-stomp';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  constructor(public rxStompService: RxStompService) {

  }
}
