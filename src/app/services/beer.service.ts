import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Beer } from '../models/beer';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BeerService {
  private beersUrl = environment.apiUrl + '/beers';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

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

  createBeer(beer: Beer): Observable<Beer> {
    console.log("Creating new beer")
    const postData = {
      brand: beer.brand,
      name: beer.name,
      type: beer.type,
      percentage: beer.percentage,
    }
    return this.http.post<Beer>(this.beersUrl + '/', postData, this.httpOptions).pipe(
      tap((newBeer: Beer) => console.log(`Added new beer ${newBeer}`)),
      catchError(this.handleError<Beer>('addBeer'))
    )
  }
  
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.log(`${operation} failed: ${error.message}`);

      throw new Error(error);
    }
  }
}
