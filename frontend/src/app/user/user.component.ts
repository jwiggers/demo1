import { Component, OnInit } from '@angular/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-user',
  template: `
  <h3>User: {{username}}</h3>
  <div *ngIf='! userService.loggedIn()'>
      <label for="name">Username: </label>
      <input type="text" id="name" required [(ngModel)]="username" #name="ngModel">
      <div [hidden]="name.valid || name.pristine" class="alert alert-danger">Kies een valide gebruikersnaam.</div>
      <div><button type="button" class="btn btn-success" (click)="logIn()">Log in!</button></div>
  </div>
  `,
  styles: []
})
export class UserComponent implements OnInit {

  private username: string;
  // public loggedIn = false;

  constructor(private rxStompService: RxStompService, private userService: UserService) { }

  ngOnInit() {
  }
  logIn() {
    this.username = this.userService.setName(this.username);
    this.rxStompService.publish({destination: '/app/user', body: JSON.stringify(this.username)});
    console.log("userService.loggedIn(): " + this.userService.loggedIn());
  }

}
