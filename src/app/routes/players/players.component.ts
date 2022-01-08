import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ApiService, Player } from "src/app/services/api.service";
import { PlayersService } from "src/app/services/players.service";

enum ViewType {
  Tile = "tile",
  Table = "table",
}

@Component({
  selector: "app-players",
  templateUrl: "./players.component.html",
  styleUrls: ["./players.component.scss"],
})
export class PlayersComponent implements OnInit {
  @ViewChild("name")
  name?: ElementRef<HTMLElement>;
  @ViewChild("occupation")
  occupation?: ElementRef<HTMLElement>;
  @ViewChild("debt")
  debt?: ElementRef<HTMLElement>;
  @ViewChild("dob")
  dob?: ElementRef<HTMLElement>;
  @ViewChild("address")
  address?: ElementRef<HTMLElement>;

  viewType: ViewType = ViewType.Table;
  viewType_t = ViewType;
  isCreatingPlayer: boolean = false;

  currentEditingPlayerID: number = -1;

  isUpdating: boolean = false;

  constructor(public api: ApiService, public playersService: PlayersService) {}

  ngOnInit(): void {}

  getObjectValues(obj: Object): any[] {
    return Object.values(obj);
  }

  getPlayersLength(obj: Object): number {
    return Object.values(obj).filter(
      (player) => !(player.isDead && !this.playersService.doShowDead.value)
    ).length;
  }

  getClasses() {
    return {
      tile: this.viewType == ViewType.Tile,
      table: this.viewType == ViewType.Table,
    };
  }

  parse2DigitInt(num: number): string {
    return `${num < 10 ? "0" : ""}${num}`;
  }

  editPlayer(id: number) {
    if (
      !this.name ||
      !this.occupation ||
      !this.debt ||
      !this.dob ||
      !this.address
    )
      return;
    this.isUpdating = true;
    this.currentEditingPlayerID = id;
    const playerMeta = this.api.players[id];
    const playerDob = new Date(playerMeta.dob);
    (this.name.nativeElement as any).value = playerMeta.name;
    (this.occupation.nativeElement as any).value = playerMeta.occupation;
    (this.debt.nativeElement as any).value = playerMeta.debt;
    (this.address.nativeElement as any).value = playerMeta.address;
    (
      this.dob.nativeElement as any
    ).value = `${playerDob.getFullYear()}-${this.parse2DigitInt(
      playerDob.getMonth() + 1
    )}-${this.parse2DigitInt(playerDob.getDay() + 1)}`;
    this.isCreatingPlayer = true;
  }

  updatePlayer() {
    if (
      !this.name ||
      !this.occupation ||
      !this.debt ||
      !this.dob ||
      !this.address
    )
      return;
    let newPlayer: Partial<Player> = {
      name: (this.name.nativeElement as any).value,
      occupation: (this.occupation.nativeElement as any).value,
      debt: parseFloat((this.debt.nativeElement as any).value),
      dob: new Date((this.dob.nativeElement as any).value).toDateString(),
      address: (this.address.nativeElement as any).value,
      isDead: false,
      atGameNumber: 1,
    };
    this.api.updatePlayer(this.currentEditingPlayerID, newPlayer);
    this.closeAddScreen();
  }

  createPlayer() {
    if (
      !this.name ||
      !this.occupation ||
      !this.debt ||
      !this.dob ||
      !this.address
    )
      return;
    this.api.createPlayer({
      name: (this.name.nativeElement as any).value,
      occupation: (this.occupation.nativeElement as any).value,
      debt: parseFloat((this.debt.nativeElement as any).value),
      dob: new Date((this.dob.nativeElement as any).value).toDateString(),
      address: (this.address.nativeElement as any).value,
      atGameNumber: 1,
      isDead: false,
    });
    this.closeAddScreen();
  }

  closeAddScreen() {
    if (
      !this.name ||
      !this.occupation ||
      !this.debt ||
      !this.dob ||
      !this.address
    )
      return;
    (this.name.nativeElement as any).value = "";
    (this.occupation.nativeElement as any).value = "";
    (this.debt.nativeElement as any).value = "";
    (this.address.nativeElement as any).value = "";
    (this.dob.nativeElement as any).value = "";
    this.isCreatingPlayer = false;
    this.isUpdating = false;
  }

  deletePlayer($parent: HTMLDivElement, id: number) {
    $parent.style.transform = "scale(0)";
    setTimeout(() => {
      this.api.deletePlayer(id);
    }, 230);
  }

  eliminatePlayer($parent: HTMLDivElement, id: number) {
    console.log(id);
    $parent.style.opacity = ".2";
    setTimeout(() => {
      this.api.updatePlayer(id, {
        ...this.api.players[id],
        isDead: true,
      });
      $parent.style.opacity = "1";
    }, 230);
  }
}
