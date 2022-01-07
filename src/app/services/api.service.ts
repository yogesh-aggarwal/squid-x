import { Injectable } from "@angular/core";
import { Apollo, gql } from "apollo-angular";

export type Player = {
  id: number;
  name: string;
  dob: Date;
  occupation: string;
  address: string;
  debt: number;
  atGameNumber: number;
  isDead: boolean;
};

export type Worker = {
  id: number;
  name: string;
  dob: Date;
  occupation: string;
  address: string;
  duty: "Manager" | "Guard" | "Utility";
};

export type Game = {
  uuid: string;
  gameNo: number;
  name: string;
  description: string;
  hasCovered: boolean;
};

@Injectable({
  providedIn: "root",
})
export class ApiService {
  players: Player[] = [];
  workers: Worker[] = [];
  games: Game[] = [];

  constructor(private apollo: Apollo) {}

  fetchData() {
    this.apollo
      .watchQuery<any>({
        query: gql`
          query {
            getAllPlayers {
              id
              name
              dob
              occupation
              address
              debt
              atGameNumber
              isDead
            }
            getAllWorkers {
              id
              name
              dob
              occupation
              address
              duty
            }
            getAllGames {
              uuid
              gameNo
              name
              description
              hasCovered
            }
          }
        `,
      })
      .valueChanges.subscribe(({ data }) => {
        this.players = data["getAllPlayers"];
        this.workers = data["getAllWorkers"];
        this.games = data["getAllGames"];
      });
  }
}
