import { Injectable } from "@angular/core";
import { Apollo, gql } from "apollo-angular";
import { BehaviorSubject } from "rxjs";

import { cloneDeep } from "lodash";

declare module "file-saver";
import { saveAs } from "file-saver";

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

export type Bet = {
  // PlayerID : Amount
  [key: number]: number;
};
export type Bets = {
  // UserID : Bet
  [key: string]: Bet;
};
export type Game = {
  uuid: string;
  gameNo: number;
  name: string;
  description: string;
  hasCovered: boolean;
  bets: Bets;
};

export type Report = {
  [key: number]: {
    games: Game[];
    players: Player[];
    workers: Worker[];
  };
};

@Injectable({
  providedIn: "root",
})
export class ApiService {
  players: { [key: number]: Player } = {};
  workers: { [key: number]: Worker } = {};
  games = new BehaviorSubject<Game[]>([]);

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
              bets
            }
          }
        `,
      })
      .valueChanges.subscribe(({ data }) => {
        let players = cloneDeep(data)["getAllPlayers"];
        players.forEach((player: Player) => {
          player = (({ __typename, ...o }) => o)(player as any);
          this.players[player.id] = player;
        });
        let workers = cloneDeep(data)["getAllWorkers"];
        workers.forEach((worker: Worker) => {
          worker = (({ __typename, ...o }) => o)(worker as any);
          this.workers[worker.id] = worker;
        });
        let games = cloneDeep(data)["getAllGames"];
        this.games.next([]);
        games.map((game: Game) => {
          game = (({ __typename, ...o }) => o)(game as any);
          this.games.next([...this.games.value, game]);
        });
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
    delete player.id;
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
      .subscribe((_) => {
        delete this.players[id];
      });
  }

  createWorker(worker: Partial<Worker>) {
    this.apollo
      .mutate<any>({
        mutation: gql`
          mutation ($worker: WorkerCreateInput) {
            createWorker(worker: $worker) {
              id
            }
          }
        `,
        variables: {
          worker: worker,
        },
      })
      .subscribe(({ data }) => {
        data = data["createWorker"];
        const newWorker = {
          ...worker,
          id: data.id,
        } as Worker;
        this.workers[newWorker.id] = newWorker;
      });
  }

  updateWorker(id: number, worker: Partial<Worker>) {
    delete worker.id;
    this.apollo
      .mutate<any>({
        mutation: gql`
          mutation ($id: Int, $worker: WorkerUpdateInput) {
            updateWorker(id: $id, worker: $worker) {
              id
              name
              dob
              duty
              occupation
              address
            }
          }
        `,
        variables: {
          id: id,
          worker: worker,
        },
      })
      .subscribe(({ data }) => {
        data = data["updateWorker"] as Worker;
        this.workers[data.id] = data;
      });
  }

  deleteWorker(id: number) {
    this.apollo
      .mutate<any>({
        mutation: gql`
          mutation ($id: Int) {
            deleteWorker(id: $id)
          }
        `,
        variables: {
          id: id,
        },
      })
      .subscribe((_) => {
        delete this.workers[id];
      });
  }

  moveToNextGame(callback?: Function) {
    this.apollo
      .mutate<any>({
        mutation: gql`
          mutation {
            moveToNextGame {
              uuid
              gameNo
              name
              description
              hasCovered
              bets
            }
          }
        `,
      })
      .subscribe(({ data }) => {
        this.games.next(data["moveToNextGame"]);
        Object.values(this.players).forEach((player) => {
          if (!player.isDead) player.atGameNumber++;
          this.players[player.id] = player;
        });
        if (callback) callback();
      });
  }

  updateGameBets(id: number, bets: Bets, callback?: Function) {
    this.apollo
      .mutate<any>({
        mutation: gql`
          mutation ($id: Int!, $bets: JSON) {
            updateGameBets(id: $id, bets: $bets) {
              uuid
            }
          }
        `,
        variables: {
          id: id,
          bets: bets,
        },
      })
      .subscribe((_) => {
        if (callback) callback();
      });
  }

  generateReport(callback: (report: Report) => void, doSave?: boolean) {
    this.apollo
      .watchQuery<any>({
        query: gql`
          query {
            getReport
          }
        `,
      })
      .valueChanges.subscribe(({ data }) => {
        data = data["getReport"] as Report;

        callback(data);

        if (Object.keys(data).length == 0) return;
        if (!doSave) return;

        const players: Player[] = data[0].players;
        const workers: Worker[] = data[0].workers;

        // -- Player report --------
        let playersReport: { [key: number]: any[] } = {};
        players.forEach((player, index) => {
          playersReport[index] = [
            player.id,
            player.name,
            "x",
            "",
            "",
            "",
            "",
            "",
          ];
        });
        Object.values(data).forEach((game: any, index: number) => {
          game.players.forEach((player: Player, playerIndex: number) => {
            playersReport[playerIndex][index + 2] = !player.isDead ? "x" : "";
          });
        });

        let winnerFound: boolean = false;
        let records: any[][] = Object.values(playersReport);
        records.map((record) => {
          if (winnerFound) return;
          if (record[7] == "x") {
            record[1] += " (Winner)";
            winnerFound = true;
          }
        });

        let csvFileContent = "";
        csvFileContent += "ID,Name,Game 1,Game 2,Game 3,Game 4,Game 5,Game 6\n";
        records.forEach(
          (record) => (csvFileContent += `${record.toString()}\n`)
        );
        saveAs(
          new Blob([csvFileContent], {
            type: "text/plain;charset=utf-8",
          }),
          "PlayersReport.csv"
        );
      });
  }
}
