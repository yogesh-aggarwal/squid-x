import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ApiService, Worker } from "src/app/services/api.service";

enum ViewType {
  Tile = "tile",
  Table = "table",
}

@Component({
  selector: "app-workers",
  templateUrl: "./workers.component.html",
  styleUrls: ["./workers.component.scss"],
})
export class WorkersComponent implements OnInit {
  @ViewChild("name")
  name?: ElementRef<HTMLElement>;
  @ViewChild("occupation")
  occupation?: ElementRef<HTMLElement>;
  @ViewChild("dob")
  dob?: ElementRef<HTMLElement>;
  @ViewChild("address")
  address?: ElementRef<HTMLElement>;

  viewType: ViewType = ViewType.Table;
  viewType_t = ViewType;
  isCreatingWorker: boolean = false;

  currentEditingWorkerID: number = -1;

  isUpdating: boolean = false;

  constructor(public api: ApiService) {}

  ngOnInit(): void {}

  getObjectValues(obj: Object): any[] {
    return Object.values(obj);
  }

  getWorkersLength(obj: Object): number {
    return Object.keys(obj).length;
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

  editWorker(id: number) {
    if (
      !this.name ||
      !this.occupation ||
      !this.dob ||
      !this.address
    )
      return;
    this.isUpdating = true;
    this.currentEditingWorkerID = id;
    const workerMeta = this.api.workers[id];
    const workerDob = new Date(workerMeta.dob);
    (this.name.nativeElement as any).value = workerMeta.name;
    (this.occupation.nativeElement as any).value = workerMeta.occupation;
    (this.address.nativeElement as any).value = workerMeta.address;
    (
      this.dob.nativeElement as any
    ).value = `${workerDob.getFullYear()}-${this.parse2DigitInt(
      workerDob.getMonth() + 1
    )}-${this.parse2DigitInt(workerDob.getDay() + 1)}`;
    this.isCreatingWorker = true;
  }

  updateWorker() {
    if (
      !this.name ||
      !this.occupation ||
      !this.dob ||
      !this.address
    )
      return;
    let newWorker: Partial<Worker> = {
      name: (this.name.nativeElement as any).value,
      occupation: (this.occupation.nativeElement as any).value,
      dob: new Date((this.dob.nativeElement as any).value).toDateString(),
      address: (this.address.nativeElement as any).value,
    };
    this.api.updateWorker(this.currentEditingWorkerID, newWorker);
    this.closeAddScreen();
  }

  createWorker() {
    if (
      !this.name ||
      !this.occupation ||
      !this.dob ||
      !this.address
    )
      return;
    this.api.createWorker({
      name: (this.name.nativeElement as any).value,
      occupation: (this.occupation.nativeElement as any).value,
      dob: new Date((this.dob.nativeElement as any).value).toDateString(),
      address: (this.address.nativeElement as any).value,
    });
    this.closeAddScreen();
  }

  closeAddScreen() {
    if (
      !this.name ||
      !this.occupation ||
      !this.dob ||
      !this.address
    )
      return;
    (this.name.nativeElement as any).value = "";
    (this.occupation.nativeElement as any).value = "";
    (this.address.nativeElement as any).value = "";
    (this.dob.nativeElement as any).value = "";
    this.isCreatingWorker = false;
    this.isUpdating = false;
  }

  deleteWorker($parent: HTMLDivElement, id: number) {
    $parent.style.transform = "scale(0)";
    setTimeout(() => {
      this.api.deleteWorker(id);
    }, 230);
  }
}
