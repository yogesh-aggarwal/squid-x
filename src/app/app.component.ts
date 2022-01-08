import { Component, OnInit } from "@angular/core";
import { ApiService } from "./services/api.service";
import { DataService } from "./services/data.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  constructor(private api: ApiService, public dataService: DataService) {}

  ngOnInit(): void {
    this.api.fetchData();
  }
}
