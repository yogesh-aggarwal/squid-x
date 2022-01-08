import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { DataService, UserType } from "src/app/services/data.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  @ViewChild("username")
  username?: ElementRef<HTMLInputElement>;

  @ViewChild("password")
  password?: ElementRef<HTMLInputElement>;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {}

  login() {
    this.dataService.user.next({
      id: Date.now(),
      type: this.username?.nativeElement.value
        .toLowerCase()
        .includes("frontman")
        ? UserType.FrontMan
        : UserType.VIP,
      name: this.username?.nativeElement.value
        .toLowerCase()
        .includes("frontman")
        ? "Front Man"
        : "VIP",
    });
  }
}
