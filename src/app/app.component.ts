import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BeerListComponent } from './components/beer-list/beer-list.component';
import { MenuComponent } from './components/menu/menu.component';
import { BeerCheckinComponent } from './components/beer-checkin/beer-checkin.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    BeerListComponent, 
    MenuComponent, 
    BeerCheckinComponent, 
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'beer-explorer-frontend';
}
