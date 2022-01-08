import { Component, OnInit } from "@angular/core";
import { ApiService, Game } from "src/app/services/api.service";
import { DataService } from "src/app/services/data.service";

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

  constructor(public api: ApiService, public dataService: DataService) {}

  decideWinner() {
    this.api.generateReport((report) => {
      console.log(report);
    });
  }

  ngOnInit(): void {
    this.decideWinner();
    this.api.games.subscribe((games) => {
      if (!games.length) return;
      for (const game of games) {
        if (!game.hasCovered) {
          if (this.nextGameNo == -1 && game.gameNo == 6) {
            this.nextGameNo = -1;
            this.api.moveToNextGame(() => {
              this.decideWinner();
            });
          } else {
            this.nextGameNo = game.gameNo;
          }
          break;
        }
      }
      this.showGameAbout(1);
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
