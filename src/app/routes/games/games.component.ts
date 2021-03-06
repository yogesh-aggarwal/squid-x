import { Component, OnInit } from "@angular/core";
import { ApiService, Game, Report } from "src/app/services/api.service";
import { DataService, UserType } from "src/app/services/data.service";

@Component({
  selector: "app-games",
  templateUrl: "./games.component.html",
  styleUrls: ["./games.component.scss"],
})
export class GamesComponent implements OnInit {
  nextGameNo: number = -1;
  doShowFullReport: boolean = false;
  doShowAbout: boolean = false;
  currentGame?: Game;

  UserType = UserType;

  constructor(public api: ApiService, public dataService: DataService) {}
  ngOnInit(): void {
    this.dataService.decideWinner();
    this.api.games.subscribe((games) => {
      if (!games.length) return;
      for (const game of games) {
        if (!game.hasCovered) {
          if (this.nextGameNo == -1 && game.gameNo == 6) {
            this.nextGameNo = -1;
            this.api.moveToNextGame(() => {
              this.dataService.decideWinner();
            });
          } else {
            this.nextGameNo = game.gameNo;
          }
          break;
        }
      }
    });
  }

  showGameStats(gameNo: number) {
    this.currentGame = this.api.games.value[gameNo - 1];
    this.doShowAbout = false;
    this.doShowFullReport = true;
  }

  closeGameStats() {
    this.currentGame = undefined;
    this.doShowAbout = false;
    this.doShowFullReport = false;
  }

  showGameAbout(gameNo: number) {
    this.currentGame = this.api.games.value[gameNo - 1];
    this.doShowAbout = true;
    this.doShowFullReport = true;
  }

  closeGameAbout() {
    this.currentGame = undefined;
    this.doShowAbout = false;
    this.doShowFullReport = false;
  }
}
