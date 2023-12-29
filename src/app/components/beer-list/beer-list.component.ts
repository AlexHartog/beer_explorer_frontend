import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';


import { Beer } from '../../models/beer';
import { BeerService } from '../../services/beer.service';

@Component({
  selector: 'app-beer-list',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule 
  ],
  templateUrl: './beer-list.component.html',
  styleUrl: './beer-list.component.scss'
})
export class BeerListComponent implements OnInit {

  // beers: Beer[] = [];
  beers: MatTableDataSource<Beer> = new MatTableDataSource<Beer>([]);
  displayedColumns: string[] = ['name', 'brand', 'type'];

  constructor(
    private beerService: BeerService,
  ) {}


  ngOnInit(): void {
    this.getBeers();
  }

  getBeers(): void {
    this.beerService.getBeers()
      .subscribe(beers => {
        this.beers = new MatTableDataSource<Beer>(beers);
      });
  }
}
