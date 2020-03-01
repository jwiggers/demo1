import { Component, OnInit} from '@angular/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';

@Component({
  selector: "app-messages",
  template: `
    <button class="btn btn-primary" (click)="onSendMessage()">
      Send Test Message
    </button>
    <h2>Received messages</h2>
    <ol>
      <li class="message" *ngFor="let message of receivedMessages">
        {{ message }}
      </li>
    </ol>
  `,
  styles: []
})
export class MessagesComponent implements OnInit {
  public receivedMessages: string[] = [];

  constructor(public rxStompService: RxStompService) {}

  ngOnInit() {
    this.rxStompService.watch("/topic/message").subscribe((message: Message) => {
      this.receivedMessages.push(message.body);
    });
  }

  onSendMessage() {
    this.rxStompService.publish({
      destination: "/app/message",
      body: `Message generated at ${new Date()}`
    });
  }
}
