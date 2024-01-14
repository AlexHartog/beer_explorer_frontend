import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Points } from '../models/stats';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PointsService {
  private pointsUrl = environment.apiUrl + '/points';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient
  ) { }

  getPoints(): Observable<Points[]> {
    return this.http.get<Points[]>(this.pointsUrl)
      .pipe(
        tap(),
        catchError(this.handleError<Points[]>('getPoints', []))
      );
  }
  
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.log(`${operation} failed: ${error.message}`);

      throw new Error(error);
    }
  }
}
