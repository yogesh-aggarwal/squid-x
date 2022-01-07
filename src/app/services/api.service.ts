import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

export type Player = {
  name: string;
  dob: number;
  occupation: string;
  address: string;
  debt: number;
};

@Injectable({
  providedIn: "root",
})
export class ApiService {
  readonly baseUrl: string = "http://localhost:3000";

  constructor(private http: HttpClient) {}

  endpointUrl(followingUrl: string): string {
    return `${this.baseUrl}/${followingUrl}`;
  }

  fetchPlayers() {
    // this.http.get(this.endpointUrl("players")).subscribe((res) => {
    //   console.log(res);
    // });
  }
}
