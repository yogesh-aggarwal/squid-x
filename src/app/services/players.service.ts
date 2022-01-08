import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PlayersService {
  doShowDead = new BehaviorSubject<boolean>(false);

  constructor() {}
}
