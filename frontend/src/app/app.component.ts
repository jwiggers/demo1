import { Component } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  greetings: string[] = [];
  showConversation = false;
  ws: any;
  name: string;
  disabled: boolean;

  constructor() {}

  connect() {
    // connect to stomp where stomp endpoint is exposed
    // let ws = new SockJS(http://localhost:8080/greeting);
    const socket = new WebSocket('ws://localhost:8080/greeting');
    this.ws = Stomp.over(socket);
    const that = this;
    this.ws.connect({}, function(frame) {
      that.ws.subscribe('/errors', function(message) {
        alert('Error ' + message.body);
      });
      that.ws.subscribe('/topic/reply', function(message) {
        console.log(message);
        that.showGreeting(message.body);
      });
      that.disabled = true;
    }, function(error) {
      alert('STOMP error ' + error);
    });
  }

  disconnect() {
    if (this.ws != null) {
      this.ws.ws.close();
    }
    this.setConnected(false);
    console.log('Disconnected');
  }

  sendName() {
    const data = JSON.stringify({
      name : this.name
    });
    this.ws.send('/app/message', {}, data);
  }

  showGreeting(message) {
    this.showConversation = true;
    this.greetings.push(message);
  }

  setConnected(connected) {
    this.disabled = connected;
    this.showConversation = connected;
    this.greetings = [];
  }
}
