import { Component, OnInit } from '@angular/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-news',
  template: `
  <div>
    <div id="news">
        <h2>News messages</h2>
        <ul>
            <li class="news" *ngFor="let newsMessage of this.newsData">{{newsMessage}}</li>
        </ul>
    </div>
  </div>`,
  styles: []
})
export class NewsComponent implements OnInit {
  private newsSubscription: Subscription;
  public newsData: string[] = [];

  constructor(public rxStompService: RxStompService) { }

  ngOnInit() {
    this.newsSubscription = this.rxStompService.watch('/topic/news').subscribe((message: Message) => {
      console.log("news: " + message.body);
      let news = JSON.parse(message.body);
      let temp = [ ...news.data, ...this.newsData ];
      this.newsData = temp.slice(0,20);
    });
  }
  ngOnDestroy() {
    this.newsSubscription.unsubscribe();
  }

}
