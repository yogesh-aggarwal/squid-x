import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/services/api.service";

enum ViewType {
  List = "list",
  Tile = "tile",
  Table = "table",
}

@Component({
  selector: "app-players",
  templateUrl: "./players.component.html",
  styleUrls: ["./players.component.scss"],
})
export class PlayersComponent implements OnInit {
  viewType: ViewType = ViewType.Tile;
  viewType_t = ViewType;
  isCreatingPlayer: boolean = false;

  constructor(public api: ApiService) {}

  ngOnInit(): void {}

  getClasses() {
    return {
      list: this.viewType == ViewType.List,
      tile: this.viewType == ViewType.Tile,
      table: this.viewType == ViewType.Table,
    };
  }

  togglePlayerCreate() {
    this.isCreatingPlayer = !this.isCreatingPlayer;
  }
}
