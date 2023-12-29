import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Beer } from '../models/beer';

@Injectable({
  providedIn: 'root'
})
export class BeerService {
  private beersUrl = 'http://192.168.1.86:8000/api/beers';

  constructor(
    private http: HttpClient
  ) { }

  getBeers(): Observable<Beer[]> {
    return this.http.get<Beer[]>(this.beersUrl)
      .pipe(
        tap(_ => console.log('fetched beers')),
        catchError(this.handleError<Beer[]>('getBeers', []))
      );
  }
  
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error);

      console.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    }
  }
}
