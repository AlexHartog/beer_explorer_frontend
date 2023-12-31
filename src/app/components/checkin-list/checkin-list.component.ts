import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';

import { Checkin } from '../../models/checkin';
import { CheckinService } from '../../services/checkin.service';

@Component({
  selector: 'app-checkin-list',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule 
  ],
  templateUrl: './checkin-list.component.html',
  styleUrl: './checkin-list.component.scss'
})
export class CheckinListComponent {
  // beers: Beer[] = [];
  checkins: MatTableDataSource<Checkin> = new MatTableDataSource<Checkin>([]);
  displayedColumns: string[] = ['date', 'user', 'brand', 'beerType', 'beerName', 'rating'];

  constructor(
    private checkinService: CheckinService,
  ) {}


  ngOnInit(): void {
    this.getCheckins();
  }

  getCheckins(): void {
    this.checkinService.getCheckins()
      .subscribe(checkins => {
        console.log('Fetched checkins: ', checkins);
        this.checkins = new MatTableDataSource<Checkin>(checkins);
      });
  }
}
