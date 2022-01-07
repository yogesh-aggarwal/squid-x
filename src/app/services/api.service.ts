import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  readonly baseUrl: string = "https://hackoverflow-cepheus.herokuapp.com";

  constructor() {}

  endpointUrl(followingUrl: string): string {
    return `${this.baseUrl}/${followingUrl}`;
  }
}
