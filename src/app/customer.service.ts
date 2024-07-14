import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private apiUrl = 'http://localhost:3000'; // Local server URL

  constructor(private _http: HttpClient) { }

  getCustomers(): Observable<any> {
    return this._http.get(`${this.apiUrl}/customers`).pipe(
      // tap(data => console.log(data)) 
    );
  }

  getTransactions(): Observable<any> {
    return this._http.get(`${this.apiUrl}/transactions`).pipe(
      // tap(data => console.log(data)) 
    );
  }
}
