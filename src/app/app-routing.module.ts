import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { GamesComponent } from "./routes/games/games.component";
import { HomeComponent } from "./routes/home/home.component";
import { PlayersComponent } from "./routes/players/players.component";
import { PrizeComponent } from "./routes/prize/prize.component";
import { WorkersComponent } from "./routes/workers/workers.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "players", component: PlayersComponent },
  { path: "workers", component: WorkersComponent },
  { path: "games", component: GamesComponent },
  { path: "prize", component: PrizeComponent },
  { path: "**", component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
