import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HomeComponent } from './routes/home/home.component';
import { PlayersComponent } from './routes/players/players.component';
import { GamesComponent } from './routes/games/games.component';
import { PrizeComponent } from './routes/prize/prize.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { WorkersComponent } from './routes/workers/workers.component';

@NgModule({
  declarations: [AppComponent, SidebarComponent, HomeComponent, PlayersComponent, GamesComponent, PrizeComponent, TopbarComponent, WorkersComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
