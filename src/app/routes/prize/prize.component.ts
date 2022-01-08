import { Component, OnInit } from "@angular/core";
import { Player } from "src/app/services/api.service";
import { DataService } from "src/app/services/data.service";

@Component({
  selector: "app-prize",
  templateUrl: "./prize.component.html",
  styleUrls: ["./prize.component.scss"],
})
export class PrizeComponent implements OnInit {
  winner?: Player;
  constructor(public dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.winner.subscribe((winner) => (this.winner = winner));
  }
}
