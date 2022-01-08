import { Injectable } from "@angular/core";
import { Apollo, gql } from "apollo-angular";

export type Player = {
  id: number;
  name: string;
  dob: string;
  occupation: string;
  address: string;
  debt: number;
  atGameNumber: number;
  isDead: boolean;
};

export type Worker = {
  id: number;
  name: string;
  dob: string;
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
  players: { [key: number]: Player } = {};
  workers: { [key: number]: Worker } = {};
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
        let players = data["getAllPlayers"];
        players.forEach((player: Player) => {
          this.players[player.id] = player;
        });
        let workers = data["getAllWorkers"];
        workers.forEach((worker: Worker) => {
          this.workers[worker.id] = worker;
        });
        this.games = Object.assign([], data["getAllGames"]);
      });
  }

  createPlayer(player: Partial<Player>) {
    this.apollo
      .mutate<any>({
        mutation: gql`
          mutation ($player: PlayerCreateInput) {
            createPlayer(player: $player) {
              id
            }
          }
        `,
        variables: {
          player: player,
        },
      })
      .subscribe(({ data }) => {
        data = data["createPlayer"];
        const newPlayer = {
          ...player,
          id: data.id,
        } as Player;
        this.players[newPlayer.id] = newPlayer;
      });
  }

  updatePlayer(id: number, player: Partial<Player>) {
    this.apollo
      .mutate<any>({
        mutation: gql`
          mutation ($id: Int, $player: PlayerUpdateInput) {
            updatePlayer(id: $id, player: $player) {
              id
              name
              dob
              occupation
              address
              debt
              atGameNumber
              isDead
            }
          }
        `,
        variables: {
          id: id,
          player: player,
        },
      })
      .subscribe(({ data }) => {
        data = data["updatePlayer"] as Player;
        this.players[data.id] = data;
      });
  }

  deletePlayer(id: number) {
    this.apollo
      .mutate<any>({
        mutation: gql`
          mutation ($id: Int) {
            deletePlayer(id: $id)
          }
        `,
        variables: {
          id: id,
        },
      })
      .subscribe(({ data }) => {
        delete this.players[data.id];
      });
  }
}
