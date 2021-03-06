import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ApiService, Worker } from "src/app/services/api.service";
import { DataService } from "src/app/services/data.service";

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
  @ViewChild("duty")
  duty?: ElementRef<HTMLElement>;
  @ViewChild("address")
  address?: ElementRef<HTMLElement>;

  viewType: ViewType = ViewType.Table;
  viewType_t = ViewType;
  isCreatingWorker: boolean = false;

  currentEditingWorkerID: number = -1;

  isUpdating: boolean = false;

  constructor(public api: ApiService, public dataService: DataService) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.dataService.currentHighlightID.next(-1);
    }, 2000);
  }

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

  selectRole(duty: HTMLDivElement, $event: MouseEvent) {
    duty.innerText = ($event.target as any).innerText;
  }

  editWorker(id: number) {
    this.isUpdating = true;
    this.currentEditingWorkerID = id;
    const workerMeta = this.api.workers[id];
    const workerDob = new Date(workerMeta.dob);
    (this.name?.nativeElement as any).value = workerMeta.name;
    (this.occupation?.nativeElement as any).value = workerMeta.occupation;
    (this.duty?.nativeElement as any).value = workerMeta.duty;
    (this.address?.nativeElement as any).value = workerMeta.address;
    (
      this.dob?.nativeElement as any
    ).value = `${workerDob.getFullYear()}-${this.parse2DigitInt(
      workerDob.getMonth() + 1
    )}-${this.parse2DigitInt(workerDob.getDay() + 1)}`;
    this.isCreatingWorker = true;
  }

  updateWorker() {
    let newWorker: Partial<Worker> = {
      name: (this.name?.nativeElement as any).value,
      occupation: (this.occupation?.nativeElement as any).value,
      dob: new Date((this.dob?.nativeElement as any).value).toDateString(),
      duty: (this.duty?.nativeElement as any).innerText,
      address: (this.address?.nativeElement as any).value,
    };
    this.api.updateWorker(this.currentEditingWorkerID, newWorker);
    this.closeAddScreen();
  }

  createWorker() {
    this.api.createWorker({
      name: (this.name?.nativeElement as any).value,
      occupation: (this.occupation?.nativeElement as any).value,
      dob: new Date((this.dob?.nativeElement as any).value).toDateString(),
      duty: (this.duty?.nativeElement as any).innerText,
      address: (this.address?.nativeElement as any).value,
    });
    this.closeAddScreen();
  }

  closeAddScreen() {
    if (!this.name || !this.occupation || !this.dob || !this.address) return;
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
