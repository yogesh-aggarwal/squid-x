import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/services/api.service";
import { DataService, UserType } from "src/app/services/data.service";

enum ResultType {
  Player = "Player",
  Worker = "Worker",
}

type SearchResult = {
  id: number;
  type: ResultType;
  title: string;
  foundFields: string[];
};

@Component({
  selector: "app-topbar",
  templateUrl: "./topbar.component.html",
  styleUrls: ["./topbar.component.scss"],
})
export class TopbarComponent implements OnInit {
  results: SearchResult[] = [];

  constructor(
    private apiService: ApiService,
    public dataService: DataService
  ) {}

  search(searchTerm: string) {
    searchTerm = searchTerm.toLowerCase().trim();
    if (!searchTerm.length) {
      this.results = [];
      return;
    }

    const userType = this.dataService.user.value?.type;

    let results: SearchResult[] = [];
    // Player
    Object.values(this.apiService.players).forEach((player) => {
      let result: SearchResult = {
        id: -1,
        type: ResultType.Player,
        title: "",
        foundFields: [],
      };
      if (player.name.toLowerCase().includes(searchTerm)) {
        result.id = player.id;
        result.title = player.name;
        result.foundFields.push("Name");
      }
      if (player.occupation.toLowerCase().includes(searchTerm)) {
        result.id = player.id;
        result.title = player.occupation;
        result.foundFields.push("Occupation");
      }
      if (player.address.toLowerCase().includes(searchTerm)) {
        result.id = player.id;
        result.title = player.address;
        result.foundFields.push("Address");
      }
      if (result.foundFields.length) results.push(result);
    });
    if (userType == UserType.FrontMan) {
      // Worker
      Object.values(this.apiService.workers).forEach((worker) => {
        let result: SearchResult = {
          id: -1,
          type: ResultType.Worker,
          title: "",
          foundFields: [],
        };
        if (worker.name.toLowerCase().includes(searchTerm)) {
          result.id = worker.id;
          result.title = worker.name;
          result.foundFields.push("Name");
        }
        if (worker.occupation.toLowerCase().includes(searchTerm)) {
          result.id = worker.id;
          result.title = worker.occupation;
          result.foundFields.push("Occupation");
        }
        if (worker.address.toLowerCase().includes(searchTerm)) {
          result.id = worker.id;
          result.title = worker.address;
          result.foundFields.push("Address");
        }
        if (worker.duty.toLowerCase().includes(searchTerm)) {
          result.id = worker.id;
          result.title = worker.duty;
          result.foundFields.push("Duty");
        }
        if (result.foundFields.length) results.push(result);
      });
    }

    this.results = results;
    console.log(results);
  }

  searchFromInput($event: Event) {
    this.search(($event.target as any).value);
  }

  selectResult(result: SearchResult) {
    this.dataService.currentHighlightID.next(result.id);
    setTimeout(() => {
      this.results = [];
    }, 60);
    setTimeout(() => {
      this.dataService.currentHighlightID.next(-1);
    }, 3500);
  }

  ngOnInit(): void {}
}
