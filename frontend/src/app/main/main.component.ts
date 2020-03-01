import { Component, OnInit } from "@angular/core";
import { RxStompService } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';
import { UserService } from '../service/user.service';

@Component({
  selector: "app-main",
  template: `
    <mat-tab-group>
      <mat-tab label="Status">
        <app-status></app-status>
      </mat-tab>
      <mat-tab label="User" *ngIf="tabEnabled.user">
        <app-user></app-user>
      </mat-tab>
      <mat-tab label="Message" *ngIf="tabEnabled.message">
        <app-messages></app-messages>
      </mat-tab>
      <mat-tab label="Stemmen" *ngIf="tabEnabled.stemmen">
        <app-stemmen></app-stemmen>
      </mat-tab>
      <mat-tab label="Nieuws" *ngIf="tabEnabled.nieuws">
        <app-news></app-news>
      </mat-tab>
      <mat-tab label="Snelheid" *ngIf="tabEnabled.snelheid">
        <app-snelheid></app-snelheid>
      </mat-tab>
      <mat-tab label="Admin" *ngIf="userService.isAdmin()">
      <div><mat-slide-toggle [(ngModel)]="tabEnabled.user" (change)="onChange()"> User </mat-slide-toggle></div>
      <div><mat-slide-toggle [(ngModel)]="tabEnabled.message" (change)="onChange()"> Message </mat-slide-toggle></div>
      <div><mat-slide-toggle [(ngModel)]="tabEnabled.stemmen" (change)="onChange()"> Stemmen </mat-slide-toggle></div>
      <div><mat-slide-toggle [(ngModel)]="tabEnabled.nieuws" (change)="onChange()"> Nieuws </mat-slide-toggle></div>
      <div><mat-slide-toggle [(ngModel)]="tabEnabled.snelheid" (change)="onChange()"> Snelheid </mat-slide-toggle></div>
      </mat-tab>
    </mat-tab-group>
  `,
  styles: []
})
export class MainComponent implements OnInit {
  tabEnabled = {user: true, message: false, stemmen: false, nieuws: false, snelheid: false}  
  receivedMessages = []
  
  constructor(public rxStompService: RxStompService, public userService: UserService) {}

  ngOnInit() {
    this.rxStompService.watch("/topic/tabs").subscribe((message: Message) => {
      this.tabEnabled = JSON.parse(message.body);
    });
  }

  onChange() {
    this.rxStompService.publish({
      destination: "/app/tabs",
      body: JSON.stringify(this.tabEnabled)
    });
  }
}
