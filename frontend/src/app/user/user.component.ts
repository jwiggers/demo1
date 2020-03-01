import { Component, OnInit } from "@angular/core";
import { RxStompService } from "@stomp/ng2-stompjs";
import { UserService } from "../service/user.service";
import { Subscription } from "rxjs";
import { Message } from '@stomp/stompjs';

@Component({
  selector: "app-user",
  template: `
    <h3>User: {{ username }}</h3>
    <div *ngIf="!userService.loggedIn()">
      <label for="name">Username: </label>
      <input
        type="text"
        id="name"
        required
        [(ngModel)]="username"
        #name="ngModel"
      />
      <div [hidden]="name.valid || name.pristine" class="alert alert-danger">
        Kies een valide gebruikersnaam.
      </div>
      <div>
        <button type="button" class="btn btn-success" (click)="logIn()">
          Log in!
        </button>
      </div>
    </div>
    <h2>Logged in users:</h2>
    <ul>
      <li class="users" *ngFor="let userId of this.loggedInUsers">
        {{ userId }}
      </li>
    </ul>
  `,
  styles: []
})
export class UserComponent implements OnInit {
  public loggedInUsers: string[] = [];
  public username: string;
  // public loggedIn = false;
  private loginSubscription: Subscription;

  constructor(
    private rxStompService: RxStompService,
    public userService: UserService
  ) {}

  ngOnInit() {
    this.loginSubscription = this.rxStompService
      .watch("/topic/users")
      .subscribe((message: Message) => {
        this.loggedInUsers = JSON.parse(message.body);
      });
  }
  logIn() {
    this.username = this.userService.setName(this.username);
    this.rxStompService.publish({
      destination: "/app/user",
      body: JSON.stringify(this.username)
    });
    console.log("userService.loggedIn(): " + this.userService.loggedIn());
  }
}
