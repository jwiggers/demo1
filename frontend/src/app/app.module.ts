import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InjectableRxStompConfig, RxStompService, rxStompServiceFactory } from '@stomp/ng2-stompjs';
import { MessagesComponent } from './messages/messages.component';
import { RxStompConfig } from './rx-stomp.config';
import { FusionChartsModule } from 'angular-fusioncharts';
import * as FusionCharts from 'fusioncharts';
import * as Charts from 'fusioncharts/fusioncharts.charts';
import * as Widgets from 'fusioncharts/fusioncharts.widgets';
import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import { MatFormFieldModule, MatInputModule, MatTabsModule, MatSlideToggleModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StemmenComponent } from './stemmen/stemmen.component';
import { NewsComponent } from './news/news.component';
import { FormsModule } from '@angular/forms';
import { UserComponent } from './user/user.component';
import { MainComponent } from './main/main.component';
import { StatusComponent } from './status/status.component';
import { SnelheidComponent } from './snelheid/snelheid.component';

FusionChartsModule.fcRoot(FusionCharts, Charts, Widgets, FusionTheme);

@NgModule({
  declarations: [
    AppComponent,
    MessagesComponent,
    StemmenComponent,
    NewsComponent,
    UserComponent,
    MainComponent,
    StatusComponent,
    SnelheidComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FusionChartsModule,
    MatFormFieldModule,
    MatInputModule, 
    MatTabsModule, 
    FormsModule,
    MatSlideToggleModule
  ],
  providers: [
    {
      provide: InjectableRxStompConfig,
      useValue: RxStompConfig
    },
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
      deps: [InjectableRxStompConfig]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
