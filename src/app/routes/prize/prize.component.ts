import { Component, OnInit } from "@angular/core";
import { DataService } from "src/app/services/data.service";

@Component({
  selector: "app-prize",
  templateUrl: "./prize.component.html",
  styleUrls: ["./prize.component.scss"],
})
export class PrizeComponent implements OnInit {
  constructor(public dataService: DataService) {}

  ngOnInit(): void {}
}
