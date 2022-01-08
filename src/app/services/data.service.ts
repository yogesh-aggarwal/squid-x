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
  winner = new BehaviorSubject<Player | undefined>({
    id: 1,
    name: "Yogesh Aggarwal",
    debt: 30000,
    address: "wdadqd",
    atGameNumber: 6,
    isDead: false,
    occupation: "occc",
    dob: new Date().toDateString(),
  });
  currentHighlightID = new BehaviorSubject<number>(-1);
  user = new BehaviorSubject<User | undefined>({
    id: 1,
    type: UserType.FrontMan,
    name: "VIPs",
  });

  constructor() {}
}
