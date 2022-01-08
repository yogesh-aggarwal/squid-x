import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { PlayersComponent } from "./routes/players/players.component";
import { GamesComponent } from "./routes/games/games.component";
import { PrizeComponent } from "./routes/prize/prize.component";
import { TopbarComponent } from "./components/topbar/topbar.component";
import { WorkersComponent } from "./routes/workers/workers.component";
import { GraphQLModule } from "./graphql.module";
import { OrderModule } from "ngx-order-pipe";
import { ModalComponent } from "./components/modal/modal.component";

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    PlayersComponent,
    GamesComponent,
    PrizeComponent,
    TopbarComponent,
    WorkersComponent,
    ModalComponent,
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
