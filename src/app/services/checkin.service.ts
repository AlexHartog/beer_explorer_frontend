import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
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

  private checkins$ = new BehaviorSubject<Checkin[]>([]);

  constructor(private http: HttpClient) { 
    this.loadCheckins();
  }

  notifyCheckinCreated() {
    this.loadCheckins(); 
  }

  private loadCheckins() {
    this.http.get<Checkin[]>(this.checkinUrl)
      .pipe(
        tap(checkins => {
          this.checkins$.next(this.sortCheckins(checkins));
        }), 
        catchError(this.handleError<Checkin[]>('getCheckins', []))
      )
      .subscribe();
  }

  getCheckins(): Observable<Checkin[]> {
    return this.checkins$.asObservable();
  }

  sortCheckins(checkins: Checkin[]): Checkin[] {
    return checkins.sort((a, b) => {
      if (a.date > b.date) {
        return -1;
      }
      if (b.date > a.date) {
        return 1;
      }
      if (a.created_at > b.created_at) {
        return -1;
      }
      else {
        return 1;
      }
    });
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
      tap((newCheckin: Checkin) => {
          console.log(`Added new checkin ${newCheckin}`);
          this.notifyCheckinCreated();
      }),
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

