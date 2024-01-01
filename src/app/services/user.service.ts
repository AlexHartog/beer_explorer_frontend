import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userUrl = environment.apiUrl + '/users';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient
  ) { }

  getUsers(): Observable<User[]> {
    console.log("Getting users from ", environment.apiUrl);
    return this.http.get<User[]>(this.userUrl)
      .pipe(
        tap(_ => console.log('fetched users')),
        catchError(this.handleError<User[]>('getUsers', []))
      );
  }

  // createCheckin(checkin: CreateCheckin): Observable<Checkin> {
  //   console.log("Creating new checkin")
  //   const postData = {
  //     beer_id: checkin.beerId,
  //     date: checkin.date.toISOString().slice(0, 10),
  //     user_id: checkin.userId
  //   }
  //   return this.http.post<Checkin>(this.userUrl + '/', postData, this.httpOptions).pipe(
  //     tap((newCheckin: Checkin) => console.log(`Added new checkin ${newCheckin}`)),
  //     catchError(this.handleError<Checkin>('addCheckin'))
  //   )
  // }
  
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.log(`${operation} failed: ${error.message}`);

      throw new Error(error);
    }
  }
}