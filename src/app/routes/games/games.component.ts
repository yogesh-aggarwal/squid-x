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
          if (this.nextGameNo == -1 && game.gameNo == 6) {
            this.nextGameNo = -1;
          } else {
            this.nextGameNo = game.gameNo;
          }
          break;
        }
      }
    });
  }
}
