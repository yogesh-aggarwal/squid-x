import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/services/api.service";
import { PlayersService } from "src/app/services/players.service";

@Component({
  selector: "app-games",
  templateUrl: "./games.component.html",
  styleUrls: ["./games.component.scss"],
})
export class GamesComponent implements OnInit {
  nextGameNo: number = -1;

  constructor(public api: ApiService, public playersService: PlayersService) {}

  ngOnInit(): void {
    this.api.games.subscribe((games) => {
      if (!games.length) return;
      for (const game of games) {
        if (!game.hasCovered) {
          this.nextGameNo = game.gameNo;
          break;
        }
      }
    });
  }
}
