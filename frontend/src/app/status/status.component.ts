import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { RxStompService } from "@stomp/ng2-stompjs";
import { RxStompState } from "@stomp/rx-stomp";
import { map } from "rxjs/operators";
import { Message } from '@stomp/stompjs';

@Component({
  selector: "app-status",
  template: `
    <div id="indicator" class="{{ connectionStatus$ | async }}"></div>
    <div>
      Connection status:
      <span id="status-label">{{ connectionStatus$ | async }}</span>
    </div>
    <div>
      <button class="btn" (click)="rxStompService.activate()">Activate</button>
      <button class="btn" (click)="rxStompService.deactivate()">
        DeActivate
      </button>
      <button
        class="btn"
        (click)="rxStompService.stompClient.forceDisconnect()"
      >
        Simulate Error
      </button>
      <h2>Error message</h2>
      {{ errorMessage }}
    </div>
  `,
  styles: []
})
export class StatusComponent implements OnInit {
  public connectionStatus$: Observable<string>;
  public errorMessage: string;

  constructor(
    public rxStompService: RxStompService,
  ) {
    this.connectionStatus$ = rxStompService.connectionState$.pipe(
      map(state => {
        return RxStompState[state];
      })
    );
  }

  ngOnInit() {
    this.rxStompService.watch('/topic/errors').subscribe((message: Message) => {
      this.errorMessage = message.body;
    });
  }
}
