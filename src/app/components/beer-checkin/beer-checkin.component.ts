import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable, startWith, map, of } from 'rxjs';
import { BeerService } from '../../services/beer.service';
import { CheckinService } from '../../services/checkin.service';
import { UserService } from '../../services/user.service';
import { Beer, beersEqual } from '../../models/beer';
import { Checkin, CreateCheckin, dateEquals } from '../../models/checkin';
import { User } from '../../models/user';

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
    MatDividerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatIconModule,
    MatCheckboxModule,
  ],
  templateUrl: './beer-checkin.component.html',
  styleUrl: './beer-checkin.component.scss'
})
export class BeerCheckinComponent implements OnInit {

  @ViewChild('newCheckinPanel') newCheckinPanel!: MatExpansionPanel;
  @ViewChild('newBeerPanel') newBeerPanel!: MatExpansionPanel;

  beers: Beer[] = [];
  checkins: Checkin[] = [];
  users: User[] = [];

  // TODO: Split the beerForm into a separate component
  beerForm: FormGroup;
  checkinForm: FormGroup;

  beerFormErrorMessage = '';
  checkinFormErrorMessage = '';

  brandOptions: string[] = [];
  beerTypeOptions: string[] = [];
  beerNameOptions: string[] = [];
  userOptions: string[] = [];

  selectedFile: File | null = null;

  filteredBrandOptions: Observable<string[]> = of([]);
  filteredBeerTypeOptions: Observable<string[]> = of([]);
  filteredBeerNameOptions: Observable<string[]> = of([]);
  filteredUserOptions: Observable<string[]> = of([]);

  constructor(
    private beerService: BeerService,
    private checkinService: CheckinService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    ) {

    this.beerForm = this.formBuilder.group({
      brandName: ['', Validators.required],
      beerType: ['', Validators.required],
      beerName: new FormControl(''),
      alcoholPercentage: [null, Validators.required],
    });

    this.checkinForm = this.formBuilder.group({
      user: ['', Validators.required],
      beer: [null, Validators.required],
      date: [new Date(), Validators.required],
      rating: [null],
      inBar: [false]
      // TODO: Add Picture and Review 

    })
  }



  ngOnInit() {
    // TODO: Move some of this to a function?
    this.loadBeerOptions();
    this.loadUsers();
    this.loadCheckins();
    this.filteredBrandOptions = this.beerForm.controls['brandName'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.brandOptions))
    );
    this.filteredBeerTypeOptions = this.beerForm.controls['beerType'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.beerTypeOptions))
    );
    this.filteredBeerNameOptions = this.beerForm.controls['beerName'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.beerNameOptions))
    );
    this.filteredUserOptions = this.checkinForm.controls['user'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.userOptions))
    );
  }


  onBeerSubmit(): void {
    // TODO: Create warning when beer already exists
    // TODO: Add percentage
    this.beerFormErrorMessage = "";

    console.log(this.beerForm.value);
    const newBeer: Beer = {
      name: this.beerForm.get('beerName')?.value,
      brand: this.beerForm.get('brandName')?.value,
      type: this.beerForm.get('beerType')?.value,
      percentage: this.beerForm.get('alcoholPercentage')?.value / 100,
    }

    if (newBeer.percentage < 0.03) {
      this.beerFormErrorMessage = "Minimum alcohol percentage is 3%";
      return
    } else if (newBeer.percentage > 1) {
      this.beerFormErrorMessage = "Alcohol percentage te hoog"
      return
    }

    this.beerService.createBeer(newBeer)
      .subscribe({
        next: beer => {
          this.beers.push(beer);
          this.checkinForm.controls["beer"].setValue(beer.id);
          this.newBeerPanel.close();
      },
      error: error => {
        // TODO: Show that we failed to create the beer
        console.log('this is an error ', error)
      }
    })
  }

  private _filter(value: string | null, options: string[]): string[] {
    // console.log('Value: ', (value ?? ''), ' in ', options);
    const filterValue = (value ?? '').toLowerCase();
    return options.filter(option => 
      option.toLowerCase().includes(filterValue)
    );
  }

  canCheckin(): boolean {
    return !this.userCheckedInToday() && this.checkinForm.valid
  }

  beerCheckedIn(): boolean {
    return this.checkins.some(checkin => checkin.beer?.id === this.checkinForm.get('beer')?.value)
  }

  userCheckedInToday(): boolean {
    if (this.getUserId() == null) {
      return false;
    }
    return this.checkins.some(checkin => checkin.user?.id == this.getUserId() && dateEquals(checkin, this.checkinForm.get('date')?.value));
  }

  currentBeer(): Beer {
    return {
      name: this.beerForm.get('beerName')?.value,
      brand: {
        name: this.beerForm.get('brandName')?.value
      },
      type: {
        name: this.beerForm.get('beerType')?.value
      },
      percentage: this.beerForm.get('beerType')?.value / 100,
    }
  }

  currentBeerId(): number | undefined {
    const beer = this.beers.find(beer => beersEqual(beer, this.currentBeer()));
    return beer?.id;
  }

  selectBeer(): void {
    const beerId = this.currentBeerId();
    if (beerId) {
      this.checkinForm.controls["beer"].setValue(beerId);
      this.newBeerPanel.close();
    }
  }

  selectedBeer(): Beer | undefined {
      return this.beers.find(beer => beer.id === this.checkinForm.get("beer")?.value);
  }

  selectedBeerString(): string {
    const beer = this.selectedBeer();
    if (beer === undefined) {
      return "Geen bier geselecteerd";
    } else {
      return `${beer.brand.name} ${beer.type.name} ${beer.name}`;
    }
  }

  beerExists(): boolean {
    return this.beers.some(beer => beersEqual(beer, this.currentBeer()));
  }

  canCreateBeer(): boolean {
    return this.beerForm.get('brandName')?.value && 
      this.beerForm.get('beerType')?.value && 
      this.beerForm.get('alcoholPercentage')?.value && 
      !this.beerExists();
  }


  loadBeerOptions(): void {
    this.beerService.getBeers()
      .subscribe(beers => {
        this.beers = beers;
        this.loadBrandOptions(beers);
        this.loadBeerTypeOptions(beers);
        this.loadBeerNameOptions(beers);
      });
  }

  loadCheckins(): void {
    this.checkinService.getCheckins()
      .subscribe(checkins => {
          this.checkins = checkins;
      });
  }

  loadUsers(): void {
    this.userService.getUsers()
      .subscribe(users => {
        this.users = users;
        this.loadUserOptions(users);
      })
  }

  convertDecimal(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    let normalizedValue = inputValue.replace(/,/g, '.');
    normalizedValue = normalizedValue.replace(/[^0-9.]/g, '');
    this.beerForm.controls["alcoholPercentage"].setValue(normalizedValue);
  }

  getUserId(): number | undefined {
    const currentUser = this.users.find(user => user.name === this.checkinForm.get('user')?.value);
    return currentUser?.id;
  }

  onFileSelected(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList) {
      this.selectedFile = fileList[0];
      console.log("File selected: ", this.selectedFile.name);
    }
  }

  onCheckinSubmit(): void {
    console.log("Creating checking")
    console.log(this.checkinForm.value);
    this.checkinFormErrorMessage = "";
    if(!this.checkinForm.valid) {
      this.checkinFormErrorMessage = "Niet alle benodigde velden zijn ingevuld"
      return
    }

    const userId = this.getUserId();
    if (!userId) {
      return
    }
    console.log("Creating with date: ", this.checkinForm.get('date')?.value);
    const newCheckin: CreateCheckin = {
      beerId: this.checkinForm.get('beer')?.value,
      userId: userId,
      date: this.checkinForm.get('date')?.value,
      in_bar: this.checkinForm.get('inBar')?.value,
      rating: this.checkinForm.get('rating')?.value,
    };
    console.log("Checkin: ", newCheckin)
    this.checkinService.createCheckin(newCheckin)
      .subscribe({
        next: checkin => {
          this.checkins.push(checkin);
          this.newCheckinPanel.close();
      },
      error: error => {
        // TODO: Show that we failed to create the checkin
        console.log('this is an error ', error)
      }
    })
  }

  triggerControlRefresh(form: FormGroup, name: string): void {
    form.controls[name].setValue(form.controls[name].value);
  }

  loadBrandOptions(beers: Beer[]): void {
    this.brandOptions = Array.from(new Set(beers.map(obj => obj.brand.name))).sort();
    this.triggerControlRefresh(this.beerForm, 'brandName');
  }

  loadBeerTypeOptions(beers: Beer[]): void {
    console.log("Reading from ", beers);
    this.beerTypeOptions = Array.from(new Set(beers.map(obj => obj.type.name))).sort();
    this.triggerControlRefresh(this.beerForm, 'beerType');
  }

  loadBeerNameOptions(beers: Beer[]): void {
    this.beerNameOptions = Array.from(new Set(beers.map(obj => obj.name))).sort();
    this.triggerControlRefresh(this.beerForm, 'beerName');
  }

  loadUserOptions(users: User[]): void {
    this.userOptions = Array.from(new Set(users.map(obj => obj.name))).sort();
    this.triggerControlRefresh(this.checkinForm, 'user');
    console.log("Useroptions: ", this.userOptions);
  }

}
