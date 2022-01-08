import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { Apollo, gql } from "apollo-angular";
import { DataService, UserType } from "src/app/services/data.service";

type Routes = {
  name: string;
  slug: string;
};

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  endpoint: string = "";

  routes: Routes[] = [];

  constructor(private router: Router, private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.user.subscribe((user) => {
      if (!user) return;
      if (user.type === UserType.FrontMan) {
        this.routes = [
          { name: "Games", slug: "games" },
          { name: "Players", slug: "players" },
          { name: "Workers", slug: "workers" },
          { name: "Prize", slug: "prize" },
        ];
      } else {
        this.routes = [
          { name: "Games", slug: "games" },
          { name: "Players", slug: "players" },
          { name: "Prize", slug: "prize" },
        ];
      }
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        let slugs = event.url.split("/");
        if (slugs.length == 1) {
          this.endpoint = "";
        } else {
          this.endpoint = slugs[1];
        }
      }
    });
  }
}
