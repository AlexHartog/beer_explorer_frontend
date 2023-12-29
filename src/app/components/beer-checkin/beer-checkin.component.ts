import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable, startWith, map, of } from 'rxjs';
import { BeerService } from '../../services/beer.service';
import { Beer } from '../../models/beer';

@Component({
  selector: 'app-beer-checkin',
  standalone: true,
  imports: [
    CommonModule, 
    MatExpansionModule, 
    ReactiveFormsModule, 
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule
  ],
  templateUrl: './beer-checkin.component.html',
  styleUrl: './beer-checkin.component.scss'
})
export class BeerCheckinComponent implements OnInit {

  // TODO: Split the beerForm into a separate component
  beerForm: FormGroup;
  checkinForm: FormGroup;

  brandOptions: string[] = [];
  beerTypeOptions: string[] = [];
  beerNameOptions: string[] = [];

  filteredBrandOptions: Observable<string[]> = of([]);
  filteredBeerTypeOptions: Observable<string[]> = of([]);
  filteredBeerNameOptions: Observable<string[]> = of([]);

  constructor(private beerService: BeerService) {
    this.beerForm = new FormGroup({
      brandNameControl: new FormControl(''),
      beerTypeControl: new FormControl(''),
      beerNameControl: new FormControl(''),
    });

    this.checkinForm = new FormGroup({
      userControl: new FormControl(''),
      beerControl: new FormControl(''),
      dateControl: new FormControl(''),
      pictureControl: new FormControl(''),
      ratingControl: new FormControl(''),
      reviewControl: new FormControl(''),

    })
  }


  ngOnInit() {
    this.loadBeerOptions();
    this.filteredBrandOptions = this.beerForm.controls['brandNameControl'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.brandOptions))
    );
    this.filteredBeerTypeOptions = this.beerForm.controls['beerTypeControl'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.beerTypeOptions))
    );
    this.filteredBeerNameOptions = this.beerForm.controls['beerNameControl'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.beerNameOptions))
    );
  }

  private _filter(value: string | null, options: string[]): string[] {
    console.log('Value: ', value, ' in ', options);
    const filterValue = (value ?? '').toLowerCase();
    return options.filter(option => 
      option.toLowerCase().includes(filterValue)
    );
  }


  loadBeerOptions(): void {
    this.beerService.getBeers()
      .subscribe(beers => {
        this.loadBrandOptions(beers);
        this.loadBeerTypeOptions(beers);
        this.loadBeerNameOptions(beers);
      });
  }

  loadBrandOptions(beers: Beer[]): void {
    this.brandOptions = Array.from(new Set(beers.map(obj => obj.brand.name)));
    this.beerForm.controls['brandNameControl'].setValue(this.beerForm.controls['brandNameControl'].value);
  }

  loadBeerTypeOptions(beers: Beer[]): void {
    this.beerTypeOptions = Array.from(new Set(beers.map(obj => obj.type.name)));
    this.beerForm.controls['beerTypeControl'].setValue(this.beerForm.controls['beerTypeControl'].value);
  }

  loadBeerNameOptions(beers: Beer[]): void {
    this.beerNameOptions = Array.from(new Set(beers.map(obj => obj.name)));
    this.beerForm.controls['beerNameControl'].setValue(this.beerForm.controls['beerNameControl'].value);
  }

}
