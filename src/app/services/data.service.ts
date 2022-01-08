import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Player } from "./api.service";

@Injectable({
  providedIn: "root",
})
export class DataService {
  doShowDeadPlayers = new BehaviorSubject<boolean>(false);
  winner = new BehaviorSubject<Player | undefined>(undefined);

  constructor() {}
}
