import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Player } from "./api.service";

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
  user = new BehaviorSubject<User | undefined>({
    id: 1,
    type: UserType.VIP,
    name: "VIPs",
  });

  constructor() {}
}
