import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private name = "";
  private admin = false;
  
  constructor() { }

  public setName(name: string) {
    this.name = name;
    if (this.name.toLowerCase() === 'jan wiggers' || this.name.toLowerCase() === 'roel de weerd') {
      this.admin = true;
      this.name = this.name.substring(0, this.name.indexOf(" "));
    }
    return this.name
  }

  public getName(): string {
    return this.name;
  }

  public isAdmin() : boolean {
    return this.admin;
  }

  public loggedIn() : boolean {
    return this.name.length > 0;
  }
}
