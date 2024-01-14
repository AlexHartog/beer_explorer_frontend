import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { MatToolbarModule } from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [ MatToolbarModule, MatIconModule, MatMenuModule, MatButtonModule, RouterModule ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  menuIsOpen = false;

  // constructor(
  //   private router: Router  // Uncomment if you need router navigation
  // ) {}

  openMenu() {
    this.menuIsOpen = !this.menuIsOpen;
  }

}
