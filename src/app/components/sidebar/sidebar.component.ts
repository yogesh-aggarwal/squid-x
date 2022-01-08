import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { Apollo, gql } from "apollo-angular";

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

  routes: Routes[] = [
    { name: "Games", slug: "games" },
    { name: "Players", slug: "players" },
    { name: "Workers", slug: "workers" },
    { name: "Prize", slug: "prize" },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
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
