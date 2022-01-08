import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ApiService, Player, Report } from "./api.service";

export enum UserType {
  FrontMan = "FrontMan",
  VIP = "VIP",
}

export type User = {
  type: UserType;
  id: number;
  name: string;
};

@Injectable({
  providedIn: "root",
})
export class DataService {
  doShowDeadPlayers = new BehaviorSubject<boolean>(false);
  winner = new BehaviorSubject<Player | undefined>(undefined);
  currentHighlightID = new BehaviorSubject<number>(-1);
  user = new BehaviorSubject<User | undefined>(undefined);

  constructor(private apiService: ApiService) {}

  decideWinner() {
    this.apiService.generateReport((report: Report) => {
      for (let player of report[5].players) {
        if (!player.isDead) {
          this.winner.next(player);
          break;
        }
      }
    });
  }
}
