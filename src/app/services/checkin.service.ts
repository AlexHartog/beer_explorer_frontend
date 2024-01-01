import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Checkin, CreateCheckin } from '../models/checkin';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckinService {
  private checkinUrl = environment.apiUrl + '/beercheckins';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient
  ) { }

  getCheckins(): Observable<Checkin[]> {
    return this.http.get<Checkin[]>(this.checkinUrl)
      .pipe(
        tap(_ => console.log('fetched checkins')),
        catchError(this.handleError<Checkin[]>('getCheckins', []))
      );
  }

  createCheckin(checkin: CreateCheckin): Observable<Checkin> {
    console.log("Creating new checkin: ", checkin);
    const postData = {
      beer_id: checkin.beerId,
      date: checkin.date.toISOString().slice(0, 10),
      user_id: checkin.userId,
      rating: checkin.rating,
    }
    return this.http.post<Checkin>(this.checkinUrl + '/', postData, this.httpOptions).pipe(
      tap((newCheckin: Checkin) => console.log(`Added new checkin ${newCheckin}`)),
      catchError(this.handleError<Checkin>('addCheckin'))
    )
  }
  
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.log(`${operation} failed: ${error.message}`);

      throw new Error(error);
    }
  }
}

