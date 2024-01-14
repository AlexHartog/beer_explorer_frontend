import { Routes } from '@angular/router';
import { CheckinListComponent } from './components/checkin-list/checkin-list.component';
import { BeerListComponent } from './components/beer-list/beer-list.component';
import { PointsComponent } from './components/points/points.component';

export const routes: Routes = [
    { path: '', redirectTo: '/checkins', pathMatch: 'full' },
    { path: 'beers', component: BeerListComponent },
    { path: 'checkins', component: CheckinListComponent },
    { path: 'points', component: PointsComponent }
  ]
