import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/services/api.service";
import { DataService } from "src/app/services/data.service";

@Component({
  selector: "app-games",
  templateUrl: "./games.component.html",
  styleUrls: ["./games.component.scss"],
})
export class GamesComponent implements OnInit {
  nextGameNo: number = -1;
  doShowFullReport: boolean = false;
  currentGameNo: number = 1;

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
    });
  }

  showGameStats(gameNo: number) {
    this.currentGameNo = gameNo;
    this.doShowFullReport = true;
  }

  closeGameStats() {
    this.currentGameNo = -1;
    this.doShowFullReport = false;
  }
}
