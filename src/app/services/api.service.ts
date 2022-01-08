import { Injectable } from "@angular/core";
import { Apollo, gql } from "apollo-angular";
import { BehaviorSubject } from "rxjs";

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

export type Game = {
  uuid: string;
  gameNo: number;
  name: string;
  description: string;
  hasCovered: boolean;
};

export type Report = {
  [key: number]: {
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
            }
          }
        `,
      })
      .valueChanges.subscribe(({ data }) => {
        let players = data["getAllPlayers"];
        players.forEach((player: Player) => {
          player = (({ __typename, ...o }) => o)(player as any);
          this.players[player.id] = player;
        });
        let workers = data["getAllWorkers"];
        workers.forEach((worker: Worker) => {
          worker = (({ __typename, ...o }) => o)(worker as any);
          this.workers[worker.id] = worker;
        });
        this.games.next(Object.assign([], data["getAllGames"]));
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

  moveToNextGame() {
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
            }
          }
        `,
      })
      .subscribe(({ data }) => {
        this.games.next(data["moveToNextGame"]);
      });
  }

  generateReport() {
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

        if (Object.keys(data).length == 0) return;

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
