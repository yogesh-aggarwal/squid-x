import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { HomeComponent } from "./routes/home/home.component";
import { PlayersComponent } from "./routes/players/players.component";
import { GamesComponent } from "./routes/games/games.component";
import { PrizeComponent } from "./routes/prize/prize.component";
import { TopbarComponent } from "./components/topbar/topbar.component";
import { WorkersComponent } from "./routes/workers/workers.component";
import { GraphQLModule } from "./graphql.module";
import { OrderModule } from "ngx-order-pipe";

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HomeComponent,
    PlayersComponent,
    GamesComponent,
    PrizeComponent,
    TopbarComponent,
    WorkersComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    GraphQLModule,
    OrderModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
